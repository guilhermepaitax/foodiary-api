
import { Controller } from '@application/contracts/Controller';
import { Profile } from '@application/entities/profile';
import { GetProfileAndGoalQuery } from '@application/query/get-profile-and-goal-query';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMeController extends Controller<'private', GetMeController.Response> {
  constructor(private readonly getProfileAndGoalQuery: GetProfileAndGoalQuery) {
    super();
  }

  protected override async handle(request: Controller.Request<'private'>): Promise<Controller.Response<GetMeController.Response>> {
    const { profile, goal } = await this.getProfileAndGoalQuery.execute({ accountId: request.accountId });

    return {
      statusCode: 200,
      body: {
        profile,
        goal,
      },
    };
  }
}

export namespace GetMeController {
  export type Response = {
    profile: {
      name: string;
      birthDate: string;
      gender: Profile.Gender;
      height: number;
      weight: number;
    };
    goal: {
      calories: number;
      proteins: number;
      carbohydrates: number;
      fats: number;
    };
  };
}
