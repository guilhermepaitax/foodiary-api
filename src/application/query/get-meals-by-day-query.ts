import { Meal } from '@application/entities/meal';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { MealItem } from '@infra/database/dynamo/items/meal-item';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class GetMealsByDayQuery {
  constructor(private readonly config: AppConfig) {}

  async execute({
    accountId,
    date,
  }: GetMealsByDayQuery.Input): Promise<GetMealsByDayQuery.Output> {

    const command = new QueryCommand({
      TableName: this.config.db.dynamodb.mainTable,
      IndexName: 'GSI1',
      ProjectionExpression: '#GSI1PK, #id, #name, #icon, #foods, #createdAt',
      KeyConditionExpression: '#GSI1PK = :GSI1PK',
      FilterExpression: '#status = :status',
      ScanIndexForward: false,
      ExpressionAttributeNames: {
       '#GSI1PK': 'GSI1PK',
       '#id': 'id',
       '#name': 'name',
       '#icon': 'icon',
       '#foods': 'foods',
       '#createdAt': 'createdAt',
       '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':GSI1PK': MealItem.getGSI1PK({ accountId, createdAt: date }),
        ':status': Meal.Status.SUCCESS,
      },
    });

    const { Items = [] } = await dynamoClient.send(command);
    const items = Items as GetMealsByDayQuery.MealItemType[];

    const meals: GetMealsByDayQuery.Output['meals'] = items.map(item => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      foods: item.foods,
      createdAt: item.createdAt,
    }));

    return { meals };
  }
}

export namespace GetMealsByDayQuery {
  export type Input = {
    accountId: string;
    date: Date;
  };

  export type MealItemType = {
    id: string;
    createdAt: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
  }

  export type Output = {
    meals: {
      id: string;
      createdAt: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
    }[];
  };
}
