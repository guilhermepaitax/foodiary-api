import {
  GetCommand,
  PutCommand,
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb';

import { Meal } from '@application/entities/meal';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { MealItem } from '@infra/database/dynamo/items/meal-item';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class MealRepository {
  constructor(private readonly config: AppConfig) {}

  getPutCommandInput(meal: Meal): PutCommandInput {
    const mealItem = MealItem.fromEntity(meal);

    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: mealItem.toItem(),
    };
  }

  async create(meal: Meal): Promise<void> {
    await dynamoClient.send(
      new PutCommand(this.getPutCommandInput(meal)),
    );
  }

  async findById({ mealId, accountId }: MealRepository.FindByIdParams): Promise<Meal | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: MealItem.getPK({ accountId, mealId }),
        SK: MealItem.getSK({ accountId, mealId }),
      },
    });

    const { Item } = await dynamoClient.send(command);

    const meal = Item as undefined | MealItem.Item;

    if (!meal) {
      return null;
    }

    return MealItem.toEntity(meal);
  }
}

export namespace MealRepository {
  export type FindByIdParams = {
    mealId: string;
    accountId: string;
  }
}
