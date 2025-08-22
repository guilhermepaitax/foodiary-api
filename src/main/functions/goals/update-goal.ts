import '@main/bootstrap';

import { UpdateGoalController } from '@application/controllers/goals/update-goal-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

export const handler = lambdaHttpAdapter(UpdateGoalController);
