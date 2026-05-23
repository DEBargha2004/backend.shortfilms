export type TConfig = {
  NODE_ENV: string;
  JWT_SECRET: string;
  PORT: string;
  S3_ACCESS_KEY: string;
  S3_SECRET_KEY: string;
  S3_URL: string;
  S3_REGION: string;
  S3_BUCKET: string;
  DB_URL: string;
  S3_CDN_ENDPOINT: string;
  MAIL_APP_PASSWORD: string;
  MAIL_APP_USER: string;
  FRONTEND_URL: string;
  VIDEO_MICROSERVICE_TOKEN: string;
  BUNNY_API_KEY: string;
  BUNNY_LIBRARY_ID: string;
  BUNNY_TRAILER_COLLECTION_ID: string;
  BUNNY_SHORTFILM_COLLECTION_ID: string;

  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
};

export default (): TConfig => ({
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  JWT_SECRET: process.env.JWT_SECRET!,
  PORT: process.env.PORT!,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY!,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY!,
  S3_URL: process.env.S3_URL!,
  S3_REGION: process.env.S3_REGION!,
  S3_BUCKET: process.env.S3_BUCKET!,
  DB_URL: process.env.DB_URL!,
  S3_CDN_ENDPOINT: process.env.S3_CDN_ENDPOINT!,
  MAIL_APP_PASSWORD: process.env.MAIL_APP_PASSWORD!,
  MAIL_APP_USER: process.env.MAIL_APP_USER!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  VIDEO_MICROSERVICE_TOKEN: process.env.VIDEO_MICROSERVICE_TOKEN!,
  BUNNY_API_KEY: process.env.BUNNY_API_KEY!,
  BUNNY_LIBRARY_ID: process.env.BUNNY_LIBRARY_ID!,
  BUNNY_TRAILER_COLLECTION_ID: process.env.BUNNY_TRAILER_COLLECTION_ID!,
  BUNNY_SHORTFILM_COLLECTION_ID: process.env.BUNNY_SHORTFILM_COLLECTION_ID!,

  ADMIN_NAME: process.env.ADMIN_NAME!,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
});
