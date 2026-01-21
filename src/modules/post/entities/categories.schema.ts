import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Categories {
  @Prop({ type: [String], required: true })
  genres: string[];

  @Prop({ type: [String], required: true })
  techniques: string[];

  @Prop({ type: [String], required: true })
  tags: string[];
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
