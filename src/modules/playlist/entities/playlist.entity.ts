import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Mongoose, Types } from 'mongoose';
import { Post } from 'src/modules/post/entities/post.entity';
import { User } from 'src/modules/user/user.entity';

@Schema({ timestamps: true })
export class Playlist {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Post.name })
  posts: Types.ObjectId[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
