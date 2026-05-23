import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import config from './libs/env';

async function init() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  );
  app.use(cookieParser());
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API List')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableShutdownHooks();

  await app.listen(config().PORT, () =>
    console.log(`Server started on port ${config().PORT}`),
  );
}

init();
