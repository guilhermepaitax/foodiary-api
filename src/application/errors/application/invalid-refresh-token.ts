import { ApplicationError } from '@application/errors/application/application-error';
import { ErrorCode } from '@application/errors/error-code';

export class InvalidRefreshToken extends ApplicationError {
  public override statusCode = 401;

  public override code: ErrorCode;

  public constructor() {
    super();

    this.name = 'InvalidRefreshToken';
    this.message = 'Invalid refresh token';
    this.code = ErrorCode.INVALID_REFRESH_TOKEN;
  }
}
