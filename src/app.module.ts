import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiModule } from './modules/api.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApiModule,
    MongooseModule.forRoot(process.env.DB_URL),
  ],
  controllers: [AppController],
})
export class AppModule {}
