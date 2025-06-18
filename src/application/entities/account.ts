import KSUID from 'ksuid';

export class Account {
  readonly id: string;

  readonly email: string;

  externalId: string | undefined;

  readonly createdAt: Date;

  constructor(attributes: Account.Attributes) {
    this.email = attributes.email;
    this.externalId = attributes.externalId;
    this.createdAt = attributes.createdAt ?? new Date();
    this.id = attributes.id ?? KSUID.randomSync().string;
  }
}

export namespace Account {
  export type Attributes = {
    email: string;
    externalId?: string;
    id?: string;
    createdAt?: Date;
  };
}
