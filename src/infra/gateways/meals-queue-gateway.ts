import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient } from '@infra/clients/sqs-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class MealsQueueGateway {
  constructor(private readonly config: AppConfig) {}

  async publish(message: MealsQueueGateway.Message): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: this.config.queues.mealsQueueUrl,
      MessageBody: JSON.stringify(message),
    });

    await sqsClient.send(command);
  }
}

export namespace MealsQueueGateway {
  export type Message = {
    accountId: string;
    mealId: string;
  }
}
