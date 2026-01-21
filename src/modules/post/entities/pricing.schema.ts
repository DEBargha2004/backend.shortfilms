import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Pricing {
  @Prop({ type: Boolean, required: true })
  isPaid: boolean;

  @Prop({ type: String })
  price?: string;
}

export const PricingSchema = SchemaFactory.createForClass(Pricing);
