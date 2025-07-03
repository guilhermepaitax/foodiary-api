import { z } from 'zod';

import { passwordPoliceSchema } from '@application/controllers/auth/schemas/password-police-schema';
import { Profile } from '@application/entities/profile';

export const signUpSchema = z.object({
  account: z.object({
    email: z.string().min(1, '"email" is required').email('Invalid email'),
    password: passwordPoliceSchema,
  }),
  profile: z.object({
    name: z.string().min(1, '"name" is required'),
    birthDate: z.string()
      .min(1, '"birthDate" is required')
      .date('"birthDate" should be a valid date (YYYY-MM-DD)')
      .transform((date) => new Date(date)),
    gender: z.nativeEnum(Profile.Gender),
    goal: z.nativeEnum(Profile.Goal),
    height: z.number().min(1, '"height" is required'),
    weight: z.number().min(1, '"weight" is required'),
    activityLevel: z.nativeEnum(Profile.ActivityLevel),
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
