import { PutCommand } from '@aws-sdk/lib-dynamodb';

import { Goal } from '@application/entities/goal';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { GoalItem } from '@infra/database/dynamo/items/goal-item';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class GoalRepository {
  constructor(private readonly config: AppConfig) {}

  async create(goal: Goal): Promise<void> {
    const goalItem = GoalItem.fromEntity(goal);

    const command = new PutCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Item: goalItem.toItem(),
    });

    await dynamoClient.send(command);
  }
}
