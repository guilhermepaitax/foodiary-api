import { ApplicationError } from '@application/errors/application/application-error';
import { ErrorCode } from '@application/errors/error-code';

export class ResourceNotFound extends ApplicationError {
  public override statusCode = 404;

  public override code: ErrorCode;

  public constructor(message?: string) {
    super();

    this.name = 'ResourceNotFound';
    this.message = message ?? 'The resource was not found';
    this.code = ErrorCode.RESOURCE_NOT_FOUND;
  }
}
