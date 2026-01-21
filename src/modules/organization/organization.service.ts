import { Injectable } from '@nestjs/common';
import { VideoProcessingService } from '../video-processing/processor.service';

@Injectable()
export class OrganizationService {
  constructor(private videoProcessingService: VideoProcessingService) {}

  async getMicroserviceTest() {
    return await this.videoProcessingService.processVideo(
      'post/video/body/14b139db-0265-45b8-8641-cc7ae81c2b99.mp4',
      '14b139db-0265-45b8-8641-cc7ae81c2b99',
    );
  }
}
