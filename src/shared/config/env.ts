import { z } from 'zod';

export const schema = z.object({
  // Cognito
  COGNITO_CLIENT_ID: z.string().min(1, 'COGNITO_CLIENT_ID is required'),
  COGNITO_CLIENT_SECRET: z.string().min(1, 'COGNITO_CLIENT_SECRET is required'),
  COGNITO_POOL_ID: z.string().min(1, 'COGNITO_POOL_ID is required'),

  // DynamoDB
  MAIN_TABLE_NAME: z.string().min(1, 'MAIN_TABLE_NAME is required'),

  // S3
  MEALS_BUCKET: z.string().min(1, 'MEALS_BUCKET is required'),

  // CDN
  MEALS_CDN_DOMAIN_NAME: z.string().min(1, 'MEALS_CDN_DOMAIN_NAME is required'),
});

export const env = schema.parse(process.env);
