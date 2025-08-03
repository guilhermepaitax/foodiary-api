import { z } from 'zod';

import { Profile } from '@application/entities/profile';

export const updateProfileSchema = z.object({
  name: z.string().min(1, '"name" is required'),
  birthDate: z.string()
    .min(1, '"birthDate" is required')
    .date('"birthDate" should be a valid date (YYYY-MM-DD)')
    .transform((date) => new Date(date)),
  gender: z.nativeEnum(Profile.Gender),
  height: z.number().min(1, '"height" is required'),
  weight: z.number().min(1, '"weight" is required'),
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
