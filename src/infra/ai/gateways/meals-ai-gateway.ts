/* eslint-disable no-console */
import OpenAI, { toFile } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatCompletionContentPart } from 'openai/resources/index';
import z from 'zod';

import { Meal } from '@application/entities/meal';
import { getImagePrompt } from '@infra/ai/prompts/get-image-prompt';
import { getTextPrompt } from '@infra/ai/prompts/get-text-prompt';
import { MealsFileStorageGateway } from '@infra/gateways/meals-file-storage-gateway';
import { Injectable } from '@kernel/decorators/injectable';
import { downloadFileFromURL } from '@shared/utils/download-file-from-url';

const mealSchema = z.object({
  name: z.string(),
  icon: z.string(),
  foods: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      calories: z.number(),
      proteins: z.number(),
      carbohydrates: z.number(),
      fats: z.number(),
    }),
  ),
});

@Injectable()
export class MealsAIGateway {
  constructor(
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}

  private readonly client = new OpenAI();

  async processMeal(meal: Meal): Promise<MealsAIGateway.ProcessMealResult> {
    const mealFileURL = this.mealsFileStorageGateway.getFileURL({
      fileKey: meal.inputFileKey,
    });

    if (meal.inputType === Meal.InputType.PICTURE) {
      return await this.callAI({
        mealId: meal.id,
        systemPrompt: getImagePrompt(),
        userMessagesParts: [
          {
            type: 'image_url',
            image_url: {
              url: mealFileURL,
              detail: 'high',
            },
          },
          {
            type: 'text',
            text: `Meal date: ${meal.createdAt}`,
          },
        ],
      });
    }

    // Process audio meal
    const transcription = await this.transcribe(mealFileURL);

    return await this.callAI({
      mealId: meal.id,
      systemPrompt: getTextPrompt(),
      userMessagesParts: `Meal date: ${meal.createdAt}\n\nMeal: ${transcription}`,
    });
  }

  private async callAI({
    mealId,
    systemPrompt,
    userMessagesParts,
  }: MealsAIGateway.CallAIParams): Promise<MealsAIGateway.ProcessMealResult> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4.1-mini',
      response_format: zodResponseFormat(mealSchema, 'meal'),
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessagesParts,
        },
      ],
    });

    const json = response.choices[0].message.content;

    if (!json) {
      console.error('OpenAI response:', JSON.stringify(response, null, 2));
      throw new Error(`Failed processing meal: "${mealId}"`);
    }

    const { success, data, error } = mealSchema.safeParse(JSON.parse(json));

    if (!success) {
      console.error('Zod error:', JSON.stringify(error.issues, null, 2));
      console.error('OpenAI response:', JSON.stringify(response, null, 2));
      throw new Error(`Failed processing meal: "${mealId}"`);
    }

    return data;
  }

  private async transcribe(audioFileURL: string): Promise<string> {
    const audioFile = await downloadFileFromURL(audioFileURL);

    const { text } = await this.client.audio.transcriptions.create({
      model: 'gpt-4o-mini-transcribe',
      file: await toFile(audioFile, 'audio.m4a', { type: 'audio/m4a' }),
    });

    return text;
  }
}

export namespace MealsAIGateway {
  export type ProcessMealResult = {
    foods: Meal.Food[];
    name: string;
    icon: string;
  };

  export type CallAIParams = {
    mealId: string;
    systemPrompt: string;
    userMessagesParts: ChatCompletionContentPart[] | string;
  };
}
