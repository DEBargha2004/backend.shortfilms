import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class SchedulingOption {
  @Prop({ type: Boolean, required: true })
  isScheduled: boolean;

  @Prop({ type: Date })
  publishDate?: Date;
}

export const SchedulingOptionSchema =
  SchemaFactory.createForClass(SchedulingOption);
