import '@main/bootstrap';

import { GetMeController } from '@application/controllers/accounts/get-me-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

import { Registry } from '@kernel/di/registry';

const controller = Registry.getInstace().resolve(GetMeController);

export const handler = lambdaHttpAdapter(controller);
