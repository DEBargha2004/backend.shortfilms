import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/user.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Doc } from 'src/types/doc';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post: Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export type TCommentDoc = Doc<Comment>;
