import { z } from 'zod';

export const updateGoalSchema = z.object({
  calories: z.number().min(0, '"calories" must be greater than 0'),
  proteins: z.number().min(0, '"proteins" must be greater than 0'),
  carbohydrates: z.number().min(0, '"carbohydrates" must be greater than 0'),
  fats: z.number().min(0, '"fats" must be greater than 0'),
});

export type UpdateGoalBody = z.infer<typeof updateGoalSchema>;
