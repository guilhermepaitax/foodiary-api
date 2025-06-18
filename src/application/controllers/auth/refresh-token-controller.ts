import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { refreshTokenSchema, type RefreshTokenBody } from '@application/controllers/auth/schemas/refresh-token-schema';
import { RefreshTokenUseCase } from '@application/usecases/auth/refresh-token-usecase';

@Injectable()
@Schema(refreshTokenSchema)
export class RefreshTokenController extends Controller<'public', RefreshTokenController.Response> {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'public', RefreshTokenBody>,
  ): Promise<Controller.Response<RefreshTokenController.Response>> {

    const { accessToken, refreshToken } = await this.refreshTokenUseCase.execute({
      refreshToken: body.refreshToken,
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

export namespace RefreshTokenController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
