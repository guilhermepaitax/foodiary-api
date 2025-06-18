import KSUID from 'ksuid';

import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class CreateMealController extends Controller<'private', CreateMealController.Response> {
  protected override async handle(request: Controller.Request<'private'>): Promise<Controller.Response<CreateMealController.Response>> {
    return {
      statusCode: 201,
      body: {
        accountId: request.accountId,
        mealId: KSUID.randomSync().string,
      },
    };
  }
}

export namespace CreateMealController {
  export type Response = {
    mealId: string;
    accountId: string;
  };
}
