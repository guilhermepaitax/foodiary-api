import '@main/bootstrap';

import { ConfirmForgotPasswordController } from '@application/controllers/auth/confirm-forgot-password-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

import { Registry } from '@kernel/di/registry';

const controller = Registry.getInstace().resolve(ConfirmForgotPasswordController);

export const handler = lambdaHttpAdapter(controller);
