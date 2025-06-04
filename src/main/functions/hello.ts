import '@main/bootstrap';

import { Registry } from '@kernel/di/registry';

import { HelloController } from '@application/controllers/hello-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Registry.getInstace().resolve(HelloController);

export const handler = lambdaHttpAdapter(controller);
