import '@main/bootstrap';

import { GetMealsByDayController } from '@application/controllers/meals/get-meals-by-day-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

import { Registry } from '@kernel/di/registry';

const controller = Registry.getInstace().resolve(GetMealsByDayController);

export const handler = lambdaHttpAdapter(controller);
