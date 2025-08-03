import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { UpdateGoalBody, updateGoalSchema } from '@application/controllers/goals/schemas/update-goal-schema';
import { UpdateGoalUsecase } from '@application/usecases/goals/update-goal-usecase';

@Injectable()
@Schema(updateGoalSchema)
export class UpdateGoalController extends Controller<'private', UpdateGoalController.Response> {
  constructor(private readonly updateGoalUseCase: UpdateGoalUsecase) {
    super();
  }

  protected override async handle(
    { body, accountId }: Controller.Request<'private', UpdateGoalBody>,
  ): Promise<Controller.Response<UpdateGoalController.Response>> {
    const { calories, proteins, carbohydrates, fats } = body;

    await this.updateGoalUseCase.execute({
      accountId,
      calories,
      proteins,
      carbohydrates,
      fats,
    });

    return {
      statusCode: 204,
    };
  }
}

export namespace UpdateGoalController {
  export type Response = void;
}
