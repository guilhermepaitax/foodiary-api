import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { helloSchema, type HelloSchema } from '@application/controllers/schemas/hello-schema';
import { HelloUseCase } from '@application/usecases/hello-usecase';

@Injectable()
@Schema(helloSchema)
export class HelloController extends Controller<unknown> {
  constructor(private readonly helloUseCase: HelloUseCase) {
    super();
  }

  protected override async handle(
    request: Controller.Request<HelloSchema>,
  ): Promise<Controller.Response<unknown>> {
    const response = await this.helloUseCase.execute({
      email: request.body.email,
    });

    return {
      statusCode: 200,
      body: {
        response,
      },
    };
  }
}
