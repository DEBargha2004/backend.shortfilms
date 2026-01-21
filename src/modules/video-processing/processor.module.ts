import { Module } from '@nestjs/common';
import { VideoProcessingService } from './processor.service';

@Module({
  providers: [VideoProcessingService],
  exports: [VideoProcessingService],
})
export class VideoProcessingModule {}
