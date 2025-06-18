import { AuthGateway } from '@infra/gateways/auth-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
  ) {}

  public async execute(params: RefreshTokenUseCase.Input): Promise<RefreshTokenUseCase.Output> {
    const { accessToken, refreshToken } = await this.authGateway.refreshToken({
      refreshToken: params.refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace RefreshTokenUseCase {
  export type Input = {
    refreshToken: string;
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
