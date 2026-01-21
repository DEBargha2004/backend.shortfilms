import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { PlaylistModule } from './playlist/playlist.module';
import { VideoProcessingModule } from './video-processing/processor.module';
import { StreamModule } from './stream/stream.module';
import { SiteMetadataModule } from './site-metadata/site-metadata.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    OrganizationModule,
    PlaylistModule,
    VideoProcessingModule,
    StreamModule,
    SiteMetadataModule,
    PostModule,
  ],
})
export class ApiModule {}
