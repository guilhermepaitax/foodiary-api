import { ApplicationError } from '@application/errors/application/application-error';
import { ErrorCode } from '@application/errors/error-code';

export class EmailAlreadyInUse extends ApplicationError {
  public override statusCode = 400;

  public override code: ErrorCode;

  public constructor() {
    super();

    this.name = 'EmailAlreadyInUse';
    this.message = 'This email is already in use';
    this.code = ErrorCode.EMAIL_ALREADY_IN_USE;
  }
}
