import { z } from 'zod';

import { passwordPoliceSchema } from '@application/controllers/auth/schemas/password-police-schema';

export const signUpSchema = z.object({
  account: z.object({
    email: z.string().min(1, '"email" is required').email('Invalid email'),
    password: passwordPoliceSchema,
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
