import { ApplicationError } from '@application/errors/application/application-error';
import { ErrorCode } from '@application/errors/error-code';

export class InvalidCredentials extends ApplicationError {
  public override statusCode = 401;

  public override code: ErrorCode;

  public constructor() {
    super();

    this.name = 'InvalidCredentials';
    this.message = 'Invalid credentials';
    this.code = ErrorCode.INVALID_CREDENTIALS;
  }
}
