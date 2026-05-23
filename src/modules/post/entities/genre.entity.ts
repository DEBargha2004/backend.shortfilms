import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Genres {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const GenreSchema = SchemaFactory.createForClass(Genres);
