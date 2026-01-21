import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { VideoProcessingModule } from '../video-processing/processor.module';
import { S3ClientProvider } from '../storage/s3.provider';

@Module({
  imports: [VideoProcessingModule],
  providers: [OrganizationService, S3ClientProvider],
  controllers: [OrganizationController],
})
export class OrganizationModule {
  constructor() {}
}
