import { Meal } from '@application/entities/meal';

export class MealItem {
  static readonly type = 'Meal';

  private readonly keys: MealItem.Keys;

  constructor(private readonly attributes: MealItem.Attributes) {
    this.keys = {
      PK: MealItem.getPK({
        mealId: this.attributes.id,
        accountId: this.attributes.accountId,
      }),
      SK: MealItem.getSK({
        mealId: this.attributes.id,
        accountId: this.attributes.accountId,
      }),
      GSI1PK: MealItem.getGSI1PK({
        accountId: this.attributes.accountId,
        createdAt: new Date(this.attributes.createdAt),
      }),
      GSI1SK: MealItem.getGSI1SK(this.attributes.id),
    };
  }

  toItem(): MealItem.Item {
    return {
      ...this.attributes,
      ...this.keys,
      type: MealItem.type,
    };
  }

  static fromEntity(meal: Meal): MealItem {
    return new MealItem({
      ...meal,
      createdAt: meal.createdAt.toISOString(),
    });
  }

  static toEntity(item: MealItem.Item): Meal {
    return new Meal({
      id: item.id,
      accountId: item.accountId,
      status: item.status,
      attempts: item.attempts,
      inputType: item.inputType,
      inputFileKey: item.inputFileKey,
      name: item.name,
      icon: item.icon,
      foods: item.foods,
      createdAt: new Date(item.createdAt),
    });
  }

  static getPK({ accountId, mealId }: MealItem.GetPKParams): MealItem.Keys['PK'] {
    return `ACCOUNT#${accountId}#MEAL#${mealId}`;
  }

  static getSK({ accountId, mealId }: MealItem.GetSKParams): MealItem.Keys['SK'] {
    return `ACCOUNT#${accountId}#MEAL#${mealId}`;
  }

  static getGSI1PK({ accountId, createdAt }: MealItem.GSI1PKParams): MealItem.Keys['GSI1PK'] {
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(createdAt.getDate()).padStart(2, '0');

    return `MEALS#${accountId}#${year}-${month}-${day}`;
  }

  static getGSI1SK(mealId: string): MealItem.Keys['GSI1SK'] {
    return `MEAL#${mealId}`;
  }
}

export namespace MealItem {
  export type Keys = {
    PK: `ACCOUNT#${string}#MEAL#${string}`;
    SK: `ACCOUNT#${string}#MEAL#${string}`;
    GSI1PK: `MEALS#${string}#${string}-${string}-${string}`;
    GSI1SK: `MEAL#${string}`;
  };

  export type Attributes = {
    id: string;
    accountId: string;
    status: Meal.Status;
    attempts: number;
    inputType: Meal.InputType;
    inputFileKey: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
    createdAt: string;
  };

  export type Item = Keys & Attributes & {
    type: 'Meal';
  };

  export type GetPKParams = {
    accountId: string;
    mealId: string;
  };

  export type GetSKParams = {
    accountId: string;
    mealId: string;
  };

  export type GSI1PKParams = {
    accountId: string;
    createdAt: Date;
  };
}
