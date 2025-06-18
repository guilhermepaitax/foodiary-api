import '@main/bootstrap';

import { ForgotPasswordController } from '@application/controllers/auth/forgot-password-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

import { Registry } from '@kernel/di/registry';

const controller = Registry.getInstace().resolve(ForgotPasswordController);

export const handler = lambdaHttpAdapter(controller);
