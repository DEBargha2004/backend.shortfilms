import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Video, VideoSchema } from './video.schema';
import { Metadata, MetadataSchema } from './metadata.schema';
import { Categories, CategoriesSchema } from './categories.schema';
import { Credit, CreditSchema } from './credit.schema';
import {
  PublishingOption,
  PublishingOptionSchema,
} from './publishing-option.schema';
import {
  SchedulingOption,
  SchedulingOptionSchema,
} from './scheduling-option.schema';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/user.entity';
import { Press, PressSchema } from './press.entity';
import { Doc } from 'src/types/doc';

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: VideoSchema, required: true })
  video: Video;

  @Prop({ type: VideoSchema, required: true })
  trailer: Video;

  @Prop({ type: MetadataSchema, required: true })
  details: Metadata;

  @Prop({ type: CategoriesSchema, required: true })
  categories: Categories;

  @Prop({ type: [String], required: true })
  playlist: string[];

  @Prop({ type: String })
  thumbnail: string;

  @Prop({ type: [CreditSchema], required: true })
  credits: Credit[];

  @Prop({ type: PublishingOptionSchema, required: true })
  publishingOption: PublishingOption;

  @Prop({ type: SchedulingOptionSchema })
  schedulingOption?: SchedulingOption;

  @Prop({ type: [PressSchema] })
  press: Press[];
}

export const PostsSchema = SchemaFactory.createForClass(Post);
export type TPostDoc = Doc<Post>;
