import { Module } from '@nestjs/common';
import { ApiModule } from './modules/api.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './libs/env';
import { EnvService } from './env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config) {
        const parsed = envSchema.safeParse(config);
        if (parsed.success) return parsed.data;

        throw new Error(`Config Validation error: ${parsed.error}`);
      },
    }),
    ApiModule,
    MongooseModule.forRoot(process.env.DB_URL),
  ],
  providers: [EnvService],
  controllers: [AppController],
})
export class AppModule {}
