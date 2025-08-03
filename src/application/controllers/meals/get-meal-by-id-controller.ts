
import { Controller } from '@application/contracts/Controller';
import { Meal } from '@application/entities/meal';
import { GetMealByIdUsecase } from '@application/usecases/meals/get-meal-by-id-usecase';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMealByIdController extends Controller<'private', GetMealByIdController.Response> {
  constructor(private readonly getMealByIdUsecase: GetMealByIdUsecase) {
    super();
  }

  protected override async handle({
    accountId,
    params,
  }: GetMealByIdController.Request,
  ): Promise<Controller.Response<GetMealByIdController.Response>> {
    const { mealId } = params;

    const { meal } = await this.getMealByIdUsecase.execute({ accountId, mealId });

    return {
      statusCode: 200,
      body: { meal },
    };
  }
}

export namespace GetMealByIdController {
  export type Params = {
    mealId: string
  }

  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    GetMealByIdController.Params
  >

  export type Response = {
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
  };
}
