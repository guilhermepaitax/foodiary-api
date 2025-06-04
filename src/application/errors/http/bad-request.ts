import { ErrorCode } from '@application/errors/error-code';
import { HttpError } from '@application/errors/http/http-error';

export class BadRequest extends HttpError {
  public override statusCode = 400;
  public override code: ErrorCode;

  public constructor(message?: any, code?: ErrorCode) {
    super();

    this.name = 'BadRequest';
    this.message = message ?? 'Bad request';
    this.code = code ?? ErrorCode.BAD_REQUEST;
  }
}
