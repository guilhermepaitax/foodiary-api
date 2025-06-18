import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { signInSchema, type SignInBody } from '@application/controllers/auth/schemas/sign-in-schema';
import { SignInUseCase } from '@application/usecases/auth/sign-in-usecase';

@Injectable()
@Schema(signInSchema)
export class SignInController extends Controller<'public', SignInController.Response> {
  constructor(private readonly signInUseCase: SignInUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'public', SignInBody>,
  ): Promise<Controller.Response<SignInController.Response>> {
    const { email, password } = body;

    const { accessToken, refreshToken } = await this.signInUseCase.execute({
      email,
      password,
    });

    return {
      statusCode: 200,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace SignInController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
