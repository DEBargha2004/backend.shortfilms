import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { MimeTypeService } from './mimetype.service';
import { StorageController } from './storage.controller';
import { S3ClientProvider } from './s3.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [StorageService, MimeTypeService, S3ClientProvider],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
