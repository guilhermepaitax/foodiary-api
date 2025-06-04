import type { Constructor } from '@shared/types/Constructor';

export class Registry {
  private static instance: Registry | undefined;

  static getInstace() {
    if (!this.instance) {
      this.instance = new Registry();
    }

    return this.instance;
  }

  private constructor() {}

  private readonly providers = new Map<string, Registry.Provider>();

  public register<T>(implementation: Constructor<T>) {
    const token = implementation.name;

    if (this.providers.has(token)) {
      throw new Error(`Provider ${token} is already registered.`);
    }

    const dependencies = Reflect.getMetadata('design:paramtypes', implementation) ?? [];

    this.providers.set(token, {
      implementation,
      dependencies,
    });
  }

  public resolve<T>(implementation: Constructor<T>): T {
    const token = implementation.name;

    const provider = this.providers.get(token);

    if (!provider) {
      throw new Error(`Provider ${token} is not registered.`);
    }

    const dependencies = provider.dependencies.map(
      (dependency) => this.resolve(dependency),
    );

    return new provider.implementation(...dependencies);
  }
}

export namespace Registry {
  export type Provider<T = any> = {
    implementation: Constructor<T>;
    dependencies: Constructor<any>[];
  };
}
