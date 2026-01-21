import * as z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  JWT_SECRET: z.string(),
  PORT: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_URL: z.string(),
  S3_REGION: z.string(),
  S3_BUCKET: z.string(),
  DB_URL: z.string(),
  S3_CDN_ENDPOINT: z.string(),
  MAIL_APP_PASSWORD: z.string(),
  MAIL_APP_USER: z.string(),
  FRONTEND_URL: z.string(),
  VIDEO_MICROSERVICE_TOKEN: z.string(),
  BUNNY_API_KEY: z.string(),
  BUNNY_LIBRARY_ID: z.string(),
  BUNNY_TRAILER_COLLECTION_ID: z.string(),
  BUNNY_SHORTFILM_COLLECTION_ID: z.string(),
});
export type TEnvSchema = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
