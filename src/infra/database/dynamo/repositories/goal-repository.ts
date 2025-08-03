import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  type PutCommandInput,
} from '@aws-sdk/lib-dynamodb';

import { Goal } from '@application/entities/goal';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { GoalItem } from '@infra/database/dynamo/items/goal-item';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class GoalRepository {
  constructor(private readonly config: AppConfig) {}

  async findByAccountId(accountId: string): Promise<Goal | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: GoalItem.getPK(accountId),
        SK: GoalItem.getSK(accountId),
      },
    });

    const goalItem = await dynamoClient.send(command);

    const goal = goalItem.Item as undefined | GoalItem.Item;

    if (!goal) {
      return null;
    }

    return GoalItem.toEntity(goal);
  }

  async save(goal: Goal): Promise<void> {
    const goalItem = GoalItem.fromEntity(goal).toItem();

    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: goalItem.PK,
        SK: goalItem.SK,
      },
      UpdateExpression:
        'SET #calories = :calories, #proteins = :proteins, #carbohydrates = :carbohydrates, #fats = :fats',
      ExpressionAttributeNames: {
        '#calories': 'calories',
        '#proteins': 'proteins',
        '#carbohydrates': 'carbohydrates',
        '#fats': 'fats',
      },
      ExpressionAttributeValues: {
        ':calories': goalItem.calories,
        ':proteins': goalItem.proteins,
        ':carbohydrates': goalItem.carbohydrates,
        ':fats': goalItem.fats,
      },
      ReturnValues: 'NONE',
    });

    await dynamoClient.send(command);
  }

  getPutCommandInput(goal: Goal): PutCommandInput {
    const goalItem = GoalItem.fromEntity(goal);

    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: goalItem.toItem(),
    };
  }

  async create(goal: Goal): Promise<void> {
    await dynamoClient.send(new PutCommand(this.getPutCommandInput(goal)));
  }
}
