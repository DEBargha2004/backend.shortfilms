import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Genres } from './genre.entity';
import { Techniques } from './technique.entity';

@Schema({ _id: false })
export class Categories {
  @Prop({
    type: [{ type: Types.ObjectId, ref: Genres.name }],
    required: true,
  })
  genres: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: Techniques.name }],
    required: true,
  })
  techniques: Types.ObjectId[];

  @Prop({ type: [String], required: true })
  tags: string[];
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
