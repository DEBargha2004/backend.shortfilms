import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/user.entity';

@Schema({ timestamps: true })
export class Credentials {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;
}

export const CredentialsSchema = SchemaFactory.createForClass(Credentials);
export type CredentialsDocument = HydratedDocument<Credentials>;
