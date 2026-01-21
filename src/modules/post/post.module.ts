import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostsSchema } from './entities/post.entity';
import { StorageModule } from '../storage/storage.module';
import { Genres, GenreSchema } from './entities/genre.entity';
import { Techniques, TechniqueSchema } from './entities/technique.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Genres.name, schema: GenreSchema }]),
    MongooseModule.forFeature([
      { name: Techniques.name, schema: TechniqueSchema },
    ]),
    StorageModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
