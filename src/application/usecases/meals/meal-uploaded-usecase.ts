import { Meal } from '@application/entities/meal';
import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository';
import { MealsFileStorageGateway } from '@infra/gateways/meals-file-storage-gateway';
import { MealsQueueGateway } from '@infra/gateways/meals-queue-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class MealUploadedUsecase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
    private readonly mealsQueueGateway: MealsQueueGateway,
  ) {}

  async execute({
    fileKey,
  }: MealUploadedUsecase.Input): Promise<MealUploadedUsecase.Output> {
    const { accountId, mealId } = await this.mealsFileStorageGateway.getFileMetadata({
      fileKey,
    });

    const meal = await this.mealRepository.findById({ accountId, mealId });

    if (!meal) {
      throw new ResourceNotFound('Meal not found');
    }

    meal.status = Meal.Status.QUEUED;

    await this.mealRepository.save(meal);
    await this.mealsQueueGateway.publish({ accountId, mealId });
  }
}

export namespace MealUploadedUsecase {
  export type Input = {
    fileKey: string;
  }

  export type Output = void
}
