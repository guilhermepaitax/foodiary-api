import '@main/bootstrap';

import { UpdateProfileController } from '@application/controllers/profiles/update-profile-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

import { Registry } from '@kernel/di/registry';

const controller = Registry.getInstace().resolve(UpdateProfileController);

export const handler = lambdaHttpAdapter(controller);
