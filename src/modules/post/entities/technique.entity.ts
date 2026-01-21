import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Techniques {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const TechniqueSchema = SchemaFactory.createForClass(Techniques);
