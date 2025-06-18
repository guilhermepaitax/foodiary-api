import { getSchema } from '@kernel/decorators/schema';

type TRouteType = 'public' | 'private';

export abstract class Controller<TType extends TRouteType, TBody = undefined> {
  protected abstract handle(request: Controller.Request<TType>): Promise<Controller.Response<TBody>>;

  public execute(request: Controller.Request<TType>): Promise<Controller.Response<TBody>> {
    const body = this.validateBody(request.body);

    return this.handle({
      ...request,
      body,
    });
  }

  private validateBody(body: Controller.Request<TType>['body']) {
    const schema = getSchema(this);

    if (schema) {
      return schema.parse(body);
    }

    return body;
  }
}

export namespace Controller {
  type BaseRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQuery = Record<string, unknown>
  > = {
    body: TBody;
    params: TParams;
    queryParams: TQuery;
  };

  type PublicRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQuery = Record<string, unknown>
  > = BaseRequest<TBody, TParams, TQuery> & {
    accountId: null;
  };

  type PrivateRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQuery = Record<string, unknown>
  > = BaseRequest<TBody, TParams, TQuery> & {
    accountId: string;
  };

  export type Request<
    TType extends TRouteType,
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQuery = Record<string, unknown>
  > = TType extends 'public'
      ? PublicRequest<TBody, TParams, TQuery>
      : PrivateRequest<TBody, TParams, TQuery>;

  export type Response<TBody = undefined> = {
    statusCode: number;
    body?: TBody;
  };
}
