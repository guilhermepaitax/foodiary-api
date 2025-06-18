import { PutCommand, type PutCommandInput } from '@aws-sdk/lib-dynamodb';

import { Goal } from '@application/entities/goal';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { GoalItem } from '@infra/database/dynamo/items/goal-item';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class GoalRepository {
  constructor(private readonly config: AppConfig) {}

  getPutCommandInput(goal: Goal): PutCommandInput {
    const goalItem = GoalItem.fromEntity(goal);

    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: goalItem.toItem(),
    };
  }

  async create(goal: Goal): Promise<void> {
    await dynamoClient.send(
      new PutCommand(this.getPutCommandInput(goal)),
    );
  }
}
