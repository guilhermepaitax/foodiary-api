import '@main/bootstrap';

import { SignInController } from '@application/controllers/auth/sign-in-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

import { Registry } from '@kernel/di/registry';

const controller = Registry.getInstace().resolve(SignInController);

export const handler = lambdaHttpAdapter(controller);
