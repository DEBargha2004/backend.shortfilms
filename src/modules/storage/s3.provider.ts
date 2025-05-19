import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';

export const S3_CLIENT = 'S3_CLIENT';

export const S3ClientProvider = {
  provide: S3_CLIENT,
  useFactory: () => {
    if (
      !process.env.S3_URL ||
      !process.env.S3_REGION ||
      !process.env.S3_ACCESS_KEY ||
      !process.env.S3_SECRET_KEY
    ) {
      throw new Error('Missing S3 credentials');
    }

    return new S3Client({
      endpoint: process.env.S3_URL,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
      forcePathStyle: true,
    });
  },
} as Provider;
