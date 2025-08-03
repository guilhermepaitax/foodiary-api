import '@main/bootstrap';

import { GetMealByIdController } from '@application/controllers/meals/get-meal-by-id-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

import { Registry } from '@kernel/di/registry';

const controller = Registry.getInstace().resolve(GetMealByIdController);

export const handler = lambdaHttpAdapter(controller);
