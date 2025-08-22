import '@main/bootstrap';

import { GetMealsByDayController } from '@application/controllers/meals/get-meals-by-day-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

export const handler = lambdaHttpAdapter(GetMealsByDayController);
