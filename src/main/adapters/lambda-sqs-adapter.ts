import { SQSHandler } from 'aws-lambda';

import { IQueueConsumer } from '@application/contracts/IQueueConsumer';
import { Registry } from '@kernel/di/registry';
import { Constructor } from '@shared/types/Constructor';

export function lambdaSQSAdapter(queueConsumerImpl: Constructor<IQueueConsumer<any>>): SQSHandler {
  return async (event) => {
    const queueConsumer = Registry.getInstace().resolve(queueConsumerImpl);

    await Promise.all(
      event.Records.map(async (record) => {
        const message = JSON.parse(record.body);

        await queueConsumer.process(message);
      }),
    );
  };
}
