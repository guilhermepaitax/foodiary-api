import '@main/bootstrap';

import { ForgotPasswordController } from '@application/controllers/auth/forgot-password-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

export const handler = lambdaHttpAdapter(ForgotPasswordController);
