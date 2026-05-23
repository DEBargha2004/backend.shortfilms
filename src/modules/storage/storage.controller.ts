import { Controller, Get, Query } from '@nestjs/common';
import { StorageService } from './storage.service';
import { Auth } from '../auth/auth.guard';

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

  @Auth()
  @Get('post/video/trailer')
  async getPreSignedUrlForPostVideoTrailer(
    @Query('mimetype') mimetype: string = 'video/mp4',
  ) {
    const url = await this.storageService.getBunnyUploadInfo();
    return url;
  }

  @Auth()
  @Get('post/video/shortfilm')
  async getPreSignedUrlForPostVideo(
    @Query('mimetype') mimetype: string = 'video/mp4',
  ) {
    const url = await this.storageService.getBunnyUploadInfo();
    return url;
  }

  @Auth()
  @Get('post/thumbnail')
  async getPresignedUrlForThumbnail(
    @Query('mimetype') mimetype: string = 'image/webp',
  ) {
    return await this.storageService.getPresignedUrl(
      'post/thumbnail',
      mimetype,
      'thumbnail',
    );
  }

  @Auth()
  @Get('post/gallery')
  async getPresignedUrlForPostGallery(
    @Query('mimetype') mimetype: string = 'image/webp',
  ) {
    return await this.storageService.getPresignedUrl(
      'post/gallery',
      mimetype,
      'post',
    );
  }

  @Get('signed-url')
  async getSignedUrl(@Query('path') path: string) {
    const res = await this.storageService.getSignedUrl(path);
    return res;
  }
}
