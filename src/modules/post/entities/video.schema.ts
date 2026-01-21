import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AllowedVideoUploadType = 'link' | 'file' | 'drive';

@Schema({ _id: false })
export class Video {
  @Prop({ type: String, required: true })
  type: AllowedVideoUploadType;

  @Prop({ type: String })
  libraryId?: string;

  @Prop({ type: String })
  path?: string;

  @Prop({ type: String })
  href?: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
