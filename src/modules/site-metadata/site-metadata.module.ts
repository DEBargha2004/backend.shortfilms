import { Module } from '@nestjs/common';
import { SiteMetadataController } from './site-metadata.controller';
import { SiteMetadataService } from './site-metadata.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SiteMetadataController],
  providers: [SiteMetadataService],
})
export class SiteMetadataModule {}
