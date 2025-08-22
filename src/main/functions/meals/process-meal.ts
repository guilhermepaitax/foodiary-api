import '@main/bootstrap';

import { MealsQueueConsumer } from '@application/queues/meals-queue-consumer';
import { lambdaSQSAdapter } from '@main/adapters/lambda-sqs-adapter';

export const handler = lambdaSQSAdapter(MealsQueueConsumer);

