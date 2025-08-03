import { z } from 'zod';

import { mbToBytes } from '@shared/utils/mb-to-bytes';

export const createMealSchema = z.object({
  file: z.object({
    type: z.enum(['audio/m4a', 'image/jpeg']),
    size: z.number()
      .min(1, 'The file should be greater than 0 bytes')
      .max(mbToBytes(10), 'The file should have a maximum of 10MB'),
  }),
});

export type CreateMealBody = z.infer<typeof createMealSchema>;
