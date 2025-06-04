import type { ErrorCode } from '@application/errors/error-code';

interface ILambdaErrorResponseParams {
  statusCode: number;
  code: ErrorCode;
  message: any;
}

export function lambdaErrorResponse(params: ILambdaErrorResponseParams) {
  return {
    statusCode: params.statusCode,
    body: JSON.stringify({
      error: {
        code: params.code,
        message: params.message,
      },
    }),
  };
}
