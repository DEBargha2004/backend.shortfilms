import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/user.entity';
import { Post } from './post.entity';
import { Doc } from 'src/types/doc';

@Schema({ timestamps: true })
export class Reaction {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post: Types.ObjectId;

  @Prop({ type: String, enum: ['like', 'dislike'], required: true })
  type: 'like' | 'dislike';
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
ReactionSchema.index({ user: 1, post: 1 }, { unique: true });
export type TReactionDoc = Doc<Reaction>;
