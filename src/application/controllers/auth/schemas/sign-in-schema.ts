import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, '"email" is required').email('Invalid email'),
  password: z.string().min(1, '"password" is required'),
});

export type SignInBody = z.infer<typeof signInSchema>;
