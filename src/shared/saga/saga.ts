import { Injectable } from '@kernel/decorators/injectable';

type CompensationFn = () => Promise<void>;

@Injectable()
export class Saga {
  private compensations: CompensationFn[] = [];

  public addCompensation(compensation: CompensationFn) {
    this.compensations.unshift(compensation);
  }

  public async compensate() {
    for await (const compensation of this.compensations) {
      try {
        await compensation();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }

    this.compensations = [];
  }

  public async run<TResult>(fn: () => Promise<TResult>) {
    try {
      return await fn();
    } catch (error) {
      await this.compensate();

      throw error;
    }
  }
}
