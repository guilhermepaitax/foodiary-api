import '@main/bootstrap';

import { RefreshTokenController } from '@application/controllers/auth/refresh-token-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

import { Registry } from '@kernel/di/registry';

const controller = Registry.getInstace().resolve(RefreshTokenController);

export const handler = lambdaHttpAdapter(controller);
