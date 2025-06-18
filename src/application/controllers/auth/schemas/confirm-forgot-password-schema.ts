import { z } from 'zod';

import { passwordPoliceSchema } from '@application/controllers/auth/schemas/password-police-schema';

export const confirmForgotPasswordSchema = z.object({
  email: z.string().min(1, '"email" is required').email('Invalid email'),
  confirmationCode: z.string().min(1, '"confirmationCode" is required'),
  password: passwordPoliceSchema,
});

export type ConfirmForgotPasswordBody = z.infer<typeof confirmForgotPasswordSchema>;
