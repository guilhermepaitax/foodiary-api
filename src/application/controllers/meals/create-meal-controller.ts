
import { Controller } from '@application/contracts/Controller';
import { CreateMealBody, createMealSchema } from '@application/controllers/meals/schemas/create-meal-schema';
import { Meal } from '@application/entities/meal';
import { CreateMealUsecase } from '@application/usecases/meals/create-meal-usecase';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

@Injectable()
@Schema(createMealSchema)
export class CreateMealController extends Controller<'private', CreateMealController.Response> {
  constructor(private readonly createMealUsecase: CreateMealUsecase) {
    super();
  }

  protected override async handle({ accountId, body }: Controller.Request<'private', CreateMealBody>): Promise<Controller.Response<CreateMealController.Response>> {
    const { file } = body;

    const inputType = file.type === 'audio/m4a' ? Meal.InputType.AUDIO : Meal.InputType.PICTURE;

    const { mealId, uploadSignature } = await this.createMealUsecase.execute({
      accountId,
      file: {
        inputType,
        size: file.size,
      },
    });

    return {
      statusCode: 201,
      body: { mealId, uploadSignature },
    };
  }
}

export namespace CreateMealController {
  export type Response = {
    mealId: string;
    uploadSignature: string;
  };
}
