import { Controller, Get, Inject, Param } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3_CLIENT } from '../storage/s3.provider';

@Controller('org')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    @Inject(S3_CLIENT) private readonly s3: S3Client,
  ) {}

  // @Get()
  // async getMicroserviceTest() {
  //   console.log('getMicroserviceTest');
  //   return this.organizationService.getMicroserviceTest();
  // }

  @Get(':videoId')
  async deleteVideoDir(@Param('videoId') videoId: string) {
    let isTruncated = true;
    let continuationToken;
    const bucket = process.env.S3_BUCKET;
    const prefix = `segments/${videoId}/`;

    while (isTruncated) {
      const listCmd = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const listRes = await this.s3.send(listCmd);
      const objects = listRes.Contents || [];

      if (objects.length > 0) {
        const deleteCmd = new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: objects.map((obj) => ({ Key: obj.Key! })),
          },
        });

        console.log('deleteCmd');
        await this.s3.send(deleteCmd);
      }

      isTruncated = listRes.IsTruncated ?? false;
      continuationToken = listRes.NextContinuationToken;
    }
  }
}
