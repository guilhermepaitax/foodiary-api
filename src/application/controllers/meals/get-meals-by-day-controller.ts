
import { Controller } from '@application/contracts/Controller';
import { getMealsByDaySchema } from '@application/controllers/meals/schemas/getMealsByDaySchema';
import { Meal } from '@application/entities/meal';
import { GetMealsByDayQuery } from '@application/query/get-meals-by-day-query';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMealsByDayController extends Controller<'private', GetMealsByDayController.Response> {
  constructor(private readonly getMealsByDayQuery: GetMealsByDayQuery) {
    super();
  }

  protected override async handle({
    accountId,
    queryParams,
  }: Controller.Request<'private'>): Promise<Controller.Response<GetMealsByDayController.Response>> {
    const { date } = getMealsByDaySchema.parse(queryParams);

    const { meals } = await this.getMealsByDayQuery.execute({ accountId, date });

    return {
      statusCode: 200,
      body: { meals },
    };
  }
}

export namespace GetMealsByDayController {
  export type Response = {
    meals: {
      id: string;
      createdAt: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
    }[];
  };
}
