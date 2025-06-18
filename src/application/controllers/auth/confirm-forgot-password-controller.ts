import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import {
  confirmForgotPasswordSchema,
  type ConfirmForgotPasswordBody,
} from '@application/controllers/auth/schemas/confirm-forgot-password-schema';
import { BadRequest } from '@application/errors/http/bad-request';
import { ConfirmForgotPasswordUseCase } from '@application/usecases/auth/confirm-forgot-password-usecase';

@Injectable()
@Schema(confirmForgotPasswordSchema)
export class ConfirmForgotPasswordController extends Controller<'public', ConfirmForgotPasswordController.Response> {
  constructor(private readonly confirmForgotPasswordUseCase: ConfirmForgotPasswordUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'public', ConfirmForgotPasswordBody>,
  ): Promise<Controller.Response<ConfirmForgotPasswordController.Response>> {
    try {
      const { email, password, confirmationCode } = body;

      await this.confirmForgotPasswordUseCase.execute({
        email,
        password,
        confirmationCode,
      });

      return {
        statusCode: 204,
      };
    } catch {
      throw new BadRequest('Failed. Try again later.');
    }
  }
}

export namespace ConfirmForgotPasswordController {
  export type Response = null;
}
