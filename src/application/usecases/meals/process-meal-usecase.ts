import { Meal } from '@application/entities/meal';
import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { MealsAIGateway } from '@infra/ai/gateways/meals-ai-gateway';
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository';
import { Injectable } from '@kernel/decorators/injectable';

const MAX_ATTEMPTS = 2;

@Injectable()
export class ProcessMealUsecase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsAIGateway: MealsAIGateway,
  ) {}

  async execute({
    mealId,
    accountId,
  }: ProcessMealUsecase.Input): Promise<ProcessMealUsecase.Output> {
    const meal = await this.mealRepository.findById({ accountId, mealId });

    if (!meal) {
      throw new ResourceNotFound(`Meal "${mealId}" not found`);
    }

    if (meal.status === Meal.Status.UPLOADING) {
      throw new Error(`Meal "${mealId}" is still uploading`);
    }

    if (meal.status === Meal.Status.PROCESSING) {
      throw new Error(`Meal "${mealId}" is already being processed`);
    }

    if (meal.status === Meal.Status.SUCCESS) {
      return;
    }

    try {
      meal.status = Meal.Status.PROCESSING;
      meal.attempts += 1;

      await this.mealRepository.save(meal);

      // TODO: Process meal with AI
      const { foods, name, icon } = await this.mealsAIGateway.processMeal(meal);

      meal.status = Meal.Status.SUCCESS;
      meal.foods = foods;
      meal.name = name;
      meal.icon = icon;

      await this.mealRepository.save(meal);

    } catch (error) {
      meal.status = meal.attempts >= MAX_ATTEMPTS
        ? Meal.Status.FAILED
        : Meal.Status.QUEUED;

      await this.mealRepository.save(meal);

      throw error;
    }
  }
}

export namespace ProcessMealUsecase {
  export type Input = {
    accountId: string;
    mealId: string;
  }

  export type Output = void;
}
