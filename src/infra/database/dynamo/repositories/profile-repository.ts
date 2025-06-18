import { PutCommand } from '@aws-sdk/lib-dynamodb';

import { Profile } from '@application/entities/profile';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { ProfileItem } from '@infra/database/dynamo/items/profile-item';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class ProfileRepository {
  constructor(private readonly config: AppConfig) {}

  async create(profile: Profile): Promise<void> {
    const profileItem = ProfileItem.fromEntity(profile);

    const command = new PutCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Item: profileItem.toItem(),
    });

    await dynamoClient.send(command);
  }
}
