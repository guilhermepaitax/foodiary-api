import { z } from 'zod';

export const schema = z.object({
  name: z.string(),
  icon: z.string(),
  foods: z.array(z.object({
    name: z.string(),
    quantity: z.string(),
    calories: z.number(),
    proteins: z.number(),
    carbohydrates: z.number(),
    fats: z.number(),
  })),
});
