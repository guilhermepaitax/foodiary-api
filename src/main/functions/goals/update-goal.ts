import '@main/bootstrap';

import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

import { UpdateGoalController } from '@application/controllers/goals/update-goal-controller';
import { Registry } from '@kernel/di/registry';

const controller = Registry.getInstace().resolve(UpdateGoalController);

export const handler = lambdaHttpAdapter(controller);
