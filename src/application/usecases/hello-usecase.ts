import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class HelloUseCase {
  public async execute(input: HelloUseCase.Input): Promise<HelloUseCase.Output> {
    return {
      message: `Hello, ${input.email}!`,
    };
  }
}

export namespace HelloUseCase {
  export type Input = {
    email: string;
  };

  export type Output = {
    message: string;
  };
}
