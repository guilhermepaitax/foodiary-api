import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { GoalRepository } from '@infra/database/dynamo/repositories/goal-repository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class UpdateGoalUsecase implements UpdateGoalUsecase {
  constructor(private readonly goalRepository: GoalRepository) {}

  async execute(
    {
      accountId,
      calories,
      proteins,
      carbohydrates,
      fats,
    }: UpdateGoalUsecase.Input,
  ): Promise<UpdateGoalUsecase.Output> {
    const goal = await this.goalRepository.findByAccountId(accountId);

    if (!goal) {
      throw new ResourceNotFound('Goal not found');
    }

    goal.calories = calories;
    goal.proteins = proteins;
    goal.carbohydrates = carbohydrates;
    goal.fats = fats;

    await this.goalRepository.save(goal);
  }
}

export namespace UpdateGoalUsecase {
  export type Input = {
    accountId: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  };

  export type Output = void;
}
