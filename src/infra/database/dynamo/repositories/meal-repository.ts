import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
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

  async save(meal: Meal): Promise<void> {
    const mealItem = MealItem.fromEntity(meal).toItem();

    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: mealItem.PK,
        SK: mealItem.SK,
      },
      UpdateExpression: 'SET #status = :status, #attempts = :attempts, #name = :name, #icon = :icon, #foods = :foods',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#attempts': 'attempts',
        '#name': 'name',
        '#icon': 'icon',
        '#foods': 'foods',
      },
      ExpressionAttributeValues: {
        ':status': mealItem.status,
        ':attempts': mealItem.attempts,
        ':name': mealItem.name,
        ':icon': mealItem.icon,
        ':foods': mealItem.foods,
      },
      ReturnValues: 'NONE',
    });

    await dynamoClient.send(command);
  }
}

export namespace MealRepository {
  export type FindByIdParams = {
    mealId: string;
    accountId: string;
  }
}
