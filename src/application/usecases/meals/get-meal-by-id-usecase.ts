import { Meal } from '@application/entities/meal';
import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository';
import { MealsFileStorageGateway } from '@infra/gateways/meals-file-storage-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMealByIdUsecase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}

  async execute({
    mealId,
    accountId,
  }: GetMealByIdUsecase.Input): Promise<GetMealByIdUsecase.Output> {
    const meal = await this.mealRepository.findById({ accountId, mealId });

    if (!meal) {
      throw new ResourceNotFound('Meal not found');
    }

    const inputFileURL = this.mealsFileStorageGateway.getFileURL({
      fileKey: meal.inputFileKey,
    });

    return {
      meal: {
        id: meal.id,
        name: meal.name,
        icon: meal.icon,
        foods: meal.foods,
        status: meal.status,
        inputType: meal.inputType,
        createdAt: meal.createdAt,
        inputFileURL,
      },
    };
  }
}

export namespace GetMealByIdUsecase {
  export type Input = {
    accountId: string;
    mealId: string;
  }

  export type Output = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.InputType;
      inputFileURL: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
      createdAt: Date;
    }
  }
}
