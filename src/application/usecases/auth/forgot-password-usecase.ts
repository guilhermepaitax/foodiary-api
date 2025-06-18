import { AuthGateway } from '@infra/gateways/auth-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
  ) {}

  public async execute({ email }: ForgotPasswordUseCase.Input): Promise<void> {
    await this.authGateway.forgotPassword({
      email,
    });
  }
}

export namespace ForgotPasswordUseCase {
  export type Input = {
    email: string;
  };
}
