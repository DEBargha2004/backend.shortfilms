import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Pricing, PricingSchema } from './pricing.schema';

@Schema({ _id: false })
export class Metadata {
  @Prop({ type: String, required: true })
  duration: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, required: true })
  language: string;

  @Prop({ type: String, required: true })
  premiereStatus: string;

  @Prop({ type: Date, required: true })
  completionDate: Date;

  @Prop({ type: String, required: true })
  ageRating: string;

  @Prop({ type: PricingSchema, required: true })
  pricing: Pricing;

  @Prop({ type: [String], required: true })
  softwareUsed: string[];
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);
