import { AuthGateway } from '@infra/gateways/auth-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class ConfirmForgotPasswordUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
  ) {}

  public async execute({
    email,
    password,
    confirmationCode,
  }: ConfirmForgotPasswordUseCase.Input): Promise<void> {
    await this.authGateway.confirmForgotPassword({
      email,
      password,
      confirmationCode,
    });
  }
}

export namespace ConfirmForgotPasswordUseCase {
  export type Input = {
    email: string;
    password: string;
    confirmationCode: string;
  };
}
