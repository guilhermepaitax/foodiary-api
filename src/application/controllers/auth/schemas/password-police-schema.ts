import { z } from 'zod';

export const passwordPoliceSchema = z.string().min(8, '"password" must contain at least 8 characters').regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  '"password" must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
);
