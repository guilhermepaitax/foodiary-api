import { Meal } from '@application/entities/meal';
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository';
import { MealsFileStorageGateway } from '@infra/gateways/meals-file-storage-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class CreateMealUsecase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}

  async execute({ accountId, file }: CreateMealUsecase.Input): Promise<CreateMealUsecase.Output> {
    const { inputType, size } = file;

    const inputFileKey = MealsFileStorageGateway.generateInputFileKey({
      accountId,
      inputType,
    });

    const meal = new Meal({
      accountId,
      inputFileKey,
      inputType,
      status: Meal.Status.UPLOADING,
    });

    const [, { uploadSignature }] = await Promise.all([
      this.mealRepository.create(meal),
      this.mealsFileStorageGateway.createPOST({
        file: {
          size,
          inputType,
          key: inputFileKey,
        },
        mealId: meal.id,
      }),
    ]);

    return {
      mealId: meal.id,
      uploadSignature,
    };
  }
}

export namespace CreateMealUsecase {
  export type Input = {
    accountId: string;
    file: {
      inputType: Meal.InputType;
      size: number;
    }
  };

  export type Output = {
    mealId: string;
    uploadSignature: string
  };
}
