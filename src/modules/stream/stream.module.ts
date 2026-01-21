import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { StorageModule } from '../storage/storage.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [StorageModule, HttpModule],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
