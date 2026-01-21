import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserIndex = 'user_index';
UserSchema.index(
  { name: 'text', email: 'text' },
  { name: UserIndex, weights: { name: 5, email: 1 } },
);

export type UserDocument = HydratedDocument<User>;
export type TDefaultUser = User & { _id: Types.ObjectId };
