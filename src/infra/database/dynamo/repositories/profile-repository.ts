import { PutCommand, type PutCommandInput } from '@aws-sdk/lib-dynamodb';

import { Profile } from '@application/entities/profile';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { ProfileItem } from '@infra/database/dynamo/items/profile-item';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class ProfileRepository {
  constructor(private readonly config: AppConfig) {}

  getPutCommandInput(profile: Profile): PutCommandInput {
    const profileItem = ProfileItem.fromEntity(profile);

    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: profileItem.toItem(),
    };
  }

  async create(profile: Profile): Promise<void> {
    await dynamoClient.send(
      new PutCommand(this.getPutCommandInput(profile)),
    );
  }
}
