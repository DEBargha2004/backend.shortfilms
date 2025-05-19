import * as z from 'zod';

const envSchema = z.object({
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
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
