import { Module } from '@nestjs/common';
import { ApiModule } from './modules/api.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import config from './libs/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ApiModule,
    MongooseModule.forRoot(config().DB_URL),
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
