import { Controller, Get, Query } from '@nestjs/common';
import { SiteMetadataService } from './site-metadata.service';

@Controller('site-metadata')
export class SiteMetadataController {
  constructor(private readonly siteMetadataService: SiteMetadataService) {}

  @Get()
  async getSiteMetadata(@Query('url') url?: string) {
    return await this.siteMetadataService.getMetadata(url);
  }
}
