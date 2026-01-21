import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Press {
  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: String, required: false })
  logo?: string;
}

export const PressSchema = SchemaFactory.createForClass(Press);
