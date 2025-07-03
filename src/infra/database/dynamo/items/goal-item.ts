import { Goal } from '@application/entities/goal';
import type { AccountItem } from '@infra/database/dynamo/items/account-item';

export class GoalItem {
  static readonly type = 'Goal';

  private readonly keys: GoalItem.Keys;

  constructor(private readonly attributes: GoalItem.Attributes) {
    this.keys = {
      PK: GoalItem.getPK(this.attributes.accountId),
      SK: GoalItem.getSK(this.attributes.accountId),
    };
  }

  toItem(): GoalItem.Item {
    return {
      ...this.attributes,
      ...this.keys,
      type: GoalItem.type,
    };
  }

  static fromEntity(goal: Goal): GoalItem {
    return new GoalItem({
      ...goal,
      createdAt: goal.createdAt.toISOString(),
    });
  }

  static toEntity(item: GoalItem.Item): Goal {
    return new Goal({
      accountId: item.accountId,
      calories: item.calories,
      proteins: item.proteins,
      carbohydrates: item.carbohydrates,
      fats: item.fats,
      createdAt: new Date(item.createdAt),
    });
  }

  static getPK(accountId: string): GoalItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): GoalItem.Keys['SK'] {
    return `ACCOUNT#${accountId}#GOAL`;
  }
}

export namespace GoalItem {
  export type Keys = {
    PK: AccountItem.Keys['PK'];
    SK: `ACCOUNT#${string}#GOAL`;
  };

  export type Attributes = {
    accountId: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    createdAt: string;
  };

  export type Item = Keys & Attributes & {
    type: 'Goal';
  };
}
