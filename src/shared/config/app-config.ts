
import { Injectable } from '@kernel/decorators/injectable';
import { env } from '@shared/config/env';

@Injectable()
export class AppConfig {
  readonly auth: AppConfig.Auth;

  readonly db: AppConfig.Database;

  readonly storage: AppConfig.Storage;

  readonly cdns: AppConfig.CDNs;

  readonly queues: AppConfig.Queues;

  constructor() {
    this.auth = {
      cognito: {
        clientId: env.COGNITO_CLIENT_ID,
        clientSecret: env.COGNITO_CLIENT_SECRET,
        poolId: env.COGNITO_POOL_ID,
      },
    };

    this.db = {
      dynamodb: {
        mainTable: env.MAIN_TABLE_NAME,
      },
    };

    this.storage = {
      s3: {
        mealsBucket: env.MEALS_BUCKET,
      },
    };

    this.cdns = {
      mealsCDN: env.MEALS_CDN_DOMAIN_NAME,
    };

    this.queues = {
      mealsQueueUrl: env.MEALS_QUEUE_URL,
    };
  }
}

export namespace AppConfig {
  export type Auth = {
    cognito: {
      clientId: string;
      clientSecret: string;
      poolId: string;
    };
  };

  export type Database = {
    dynamodb: {
      mainTable: string;
    };
  };

  export type Storage = {
    s3: {
      mealsBucket: string;
    };
  };

  export type CDNs = {
    mealsCDN: string;
  };

  export type Queues = {
    mealsQueueUrl: string;
  };
}
