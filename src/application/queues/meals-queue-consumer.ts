import { IQueueConsumer } from '@application/contracts/IQueueConsumer';
import { ProcessMealUsecase } from '@application/usecases/meals/process-meal-usecase';
import { MealsQueueGateway } from '@infra/gateways/meals-queue-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class MealsQueueConsumer implements IQueueConsumer<MealsQueueGateway.Message> {
  constructor(private readonly processMealUsecase: ProcessMealUsecase) {}

  async process({ accountId, mealId }: MealsQueueGateway.Message): Promise<void> {
    await this.processMealUsecase.execute({ accountId, mealId });
  }
}
