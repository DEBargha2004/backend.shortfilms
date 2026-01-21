import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './entities/playlist.entity';

@Module({
  controllers: [PlaylistController],
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
  ],
  providers: [PlaylistService],
  exports: [],
})
export class PlaylistModule {}
