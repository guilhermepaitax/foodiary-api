import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { forgotPasswordSchema, type ForgotPasswordBody } from '@application/controllers/auth/schemas/forgot-password-schema';
import { ForgotPasswordUseCase } from '@application/usecases/auth/forgot-password-usecase';

@Injectable()
@Schema(forgotPasswordSchema)
export class ForgotPasswordController extends Controller<'public', ForgotPasswordController.Response> {
  constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'public', ForgotPasswordBody>,
  ): Promise<Controller.Response<ForgotPasswordController.Response>> {
    try {
      const { email } = body;

      await this.forgotPasswordUseCase.execute({ email });
    } catch {
      //
    }

    return {
      statusCode: 204,
    };
  }
}

export namespace ForgotPasswordController {
  export type Response = null;
}
