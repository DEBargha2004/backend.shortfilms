import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class PublishingOption {
  @Prop({ type: Boolean, required: true })
  copyrightPermission: boolean;

  @Prop({ type: String, required: true })
  publishType: string;

  @Prop({ type: String })
  password?: string;
}

export const PublishingOptionSchema =
  SchemaFactory.createForClass(PublishingOption);
