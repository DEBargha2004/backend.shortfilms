import { Controller, Get, Query } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('user/profile')
  async getPreSignedUrlForUserProfile(
    @Query('mimetype') mimetype: string = 'image/webp',
  ) {
    const url = await this.storageService.getPresignedUrl(
      'user/profile',
      mimetype,
      'userProfile',
    );
    return url;
  }
}
