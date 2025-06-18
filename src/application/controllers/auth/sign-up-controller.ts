import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { signUpSchema, type SignUpBody } from '@application/controllers/auth/schemas/sign-up-schema';
import { SignUpUseCase } from '@application/usecases/auth/sign-up-usecase';

@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<'public', SignUpController.Response> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'public', SignUpBody>,
  ): Promise<Controller.Response<SignUpController.Response>> {
    const { account } = body;

    const { accessToken, refreshToken } = await this.signUpUseCase.execute(account);

    return {
      statusCode: 201,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace SignUpController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
