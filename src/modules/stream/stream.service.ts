import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class StreamService {
  constructor(
    private readonly storageService: StorageService,
    private readonly httpService: HttpService,
  ) {}

  private patchMpd(mpd: string, videoId: string) {
    return mpd
      .replace(
        /initialization="([^"]+)"/g,
        (_, filename) =>
          `initialization="/api/v1/stream/${videoId}/${filename.replace('/', '-')}"`,
      )
      .replace(
        /media="([^"]+)"/g,
        (_, filename) =>
          `media="/api/v1/stream/${videoId}/${filename.replace('/', '-')}"`,
      );
  }

  async getMpd(videoid: string) {
    const mpdKey = `segments/${videoid}/manifest.mpd`;
    return await this.storageService.getSignedUrl(mpdKey);
  }

  async getSegmentUrl(videoId: string, rendition: string, segment: string) {
    return await this.storageService.getSignedUrl(
      `segments/${videoId}/${rendition}/${segment}`,
    );
  }
}
