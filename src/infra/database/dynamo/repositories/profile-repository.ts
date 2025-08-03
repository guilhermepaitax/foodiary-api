import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  type PutCommandInput,
} from '@aws-sdk/lib-dynamodb';

import { Profile } from '@application/entities/profile';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { ProfileItem } from '@infra/database/dynamo/items/profile-item';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class ProfileRepository {
  constructor(private readonly config: AppConfig) {}

  async findByAccountId(accountId: string): Promise<Profile | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: ProfileItem.getPK(accountId),
        SK: ProfileItem.getSK(accountId),
      },
    });

    const profileItem = await dynamoClient.send(command);

    const profile = profileItem.Item as undefined | ProfileItem.Item;

    if (!profile) {
      return null;
    }

    return ProfileItem.toEntity(profile);
  }

  async save(profile: Profile): Promise<void> {
    const profileItem = ProfileItem.fromEntity(profile).toItem();

    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: profileItem.PK,
        SK: profileItem.SK,
      },
      UpdateExpression: 'SET #name = :name, #birthDate = :birthDate, #gender = :gender, #height = :height, #weight = :weight',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#birthDate': 'birthDate',
        '#gender': 'gender',
        '#height': 'height',
        '#weight': 'weight',
      },
      ExpressionAttributeValues: {
        ':name': profileItem.name,
        ':birthDate': profileItem.birthDate,
        ':gender': profileItem.gender,
        ':height': profileItem.height,
        ':weight': profileItem.weight,
      },
      ReturnValues: 'NONE',
    });

    await dynamoClient.send(command);
  }

  getPutCommandInput(profile: Profile): PutCommandInput {
    const profileItem = ProfileItem.fromEntity(profile);

    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: profileItem.toItem(),
    };
  }

  async create(profile: Profile): Promise<void> {
    await dynamoClient.send(new PutCommand(this.getPutCommandInput(profile)));
  }
}
