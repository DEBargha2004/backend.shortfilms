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

@Injectable()
export class StorageService {
  constructor(
    private readonly mimetypeService: MimeTypeService,
    @Inject(S3_CLIENT) private readonly s3: S3Client,
  ) {}

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
