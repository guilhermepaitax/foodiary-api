import { getSchema } from '@kernel/decorators/schema';

export abstract class Controller<TBody = undefined> {
  protected abstract handle(request: Controller.Request): Promise<Controller.Response<TBody>>;

  public execute(request: Controller.Request): Promise<Controller.Response<TBody>> {
    const body = this.validateBody(request.body);

    return this.handle({
      ...request,
      body,
    });
  }

  private validateBody(body: Controller.Request['body']) {
    const schema = getSchema(this);

    if (schema) {
      return schema.parse(body);
    }

    return body;
  }
}

export namespace Controller {
  export type Request<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQuery = Record<string, unknown>
  > = {
    body: TBody;
    params: TParams;
    queryParams: TQuery;
  };

  export type Response<TBody = undefined> ={
    statusCode: number;
    body?: TBody;
  };
}
