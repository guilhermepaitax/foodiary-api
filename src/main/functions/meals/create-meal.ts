import '@main/bootstrap';

import { CreateMealController } from '@application/controllers/meals/create-meal-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

import { Registry } from '@kernel/di/registry';

const controller = Registry.getInstace().resolve(CreateMealController);

export const handler = lambdaHttpAdapter(controller);
