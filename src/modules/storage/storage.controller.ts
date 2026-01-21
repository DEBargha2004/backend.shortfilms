import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { MicroserviceGuard } from 'src/common/guards/microservice';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('post/video/trailer')
  async getPreSignedUrlForPostVideoTrailer(
    @Query('mimetype') mimetype: string = 'video/mp4',
  ) {
    const url = await this.storageService.getBunnyUploadInfo();
    return url;
  }

  @UseGuards(JwtAuthGuard)
  @Get('post/video/shortfilm')
  async getPreSignedUrlForPostVideo(
    @Query('mimetype') mimetype: string = 'video/mp4',
  ) {
    const url = await this.storageService.getBunnyUploadInfo();
    return url;
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
