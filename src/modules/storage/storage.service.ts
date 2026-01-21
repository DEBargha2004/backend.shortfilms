import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MimeTypeService } from './mimetype.service';
import { EntityType } from './mimetypes';
import { S3_CLIENT } from './s3.provider';
import { ErrorMessage } from 'src/libs/error';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';

export type VideoEntity = 'shortfilm' | 'trailer';

@Injectable()
export class StorageService {
  constructor(
    private readonly mimetypeService: MimeTypeService,
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly httpService: HttpService,
  ) {}

  async checkBunnyVideo(videoId: string, entitytype: VideoEntity) {
    try {
      const res = await firstValueFrom(
        this.httpService.head(
          `https://video.bunnycdn.com/play/${process.env.BUNNY_LIBRARY_ID}/${videoId}`,
        ),
      );

      if (res.status === 200) return true;
      return false;
    } catch (error) {
      return false;
    }
  }

  async getPresignedUrl(
    path: string,
    contentType: string,
    entitytype: EntityType,
  ) {
    const isValidMimeType = this.mimetypeService.isValidMimeType(
      contentType,
      entitytype,
    );
    if (!isValidMimeType)
      throw new HttpException(
        new ErrorMessage('INVALID_MIMETYPE', 'Invalid mimetype'),
        HttpStatus.BAD_REQUEST,
      );

    path = `${path}/${crypto.randomUUID()}.${this.mimetypeService.getExtension(contentType)}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: path,
      ContentType: contentType,
      // ContentLength: 1024 * 1024, // 1 MB
    });

    const url = await getSignedUrl(this.s3, command, {
      expiresIn: 5 * 60,
    });

    return { url, path: path };
  }

  async getBunnyUploadInfo() {
    const res = await firstValueFrom(
      this.httpService.post(
        `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos`,
        {
          title: crypto.randomUUID(),
          collectionId: process.env.BUNNY_SHORTFILM_COLLECTION_ID,
        },
        {
          headers: {
            AccessKey: process.env.BUNNY_API_KEY,
          },
        },
      ),
    );
    const videoId = res.data.guid;
    // console.log(videoId, 'video id');

    const expires = Math.floor(Date.now() / 1000) + 3000;
    const sig = crypto
      .createHash('sha256')
      .update(
        `${process.env.BUNNY_LIBRARY_ID}${process.env.BUNNY_API_KEY}${expires}${videoId}`,
      )
      .digest('hex');

    return {
      signature: sig,
      videoId,
      libraryId: process.env.BUNNY_LIBRARY_ID,
      expires,
    };
  }

  async getSignedUrl(path: string) {
    if (!path) return '';

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: path,
    });

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 24 * 60 * 60,
    });

    return signedUrl;
  }
}
