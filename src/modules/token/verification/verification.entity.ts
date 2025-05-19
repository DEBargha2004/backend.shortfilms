import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/modules/user/user.entity';

@Schema({ timestamps: true })
export class Verification {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  token: string;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
VerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 60 });

export type VerificationDocument = HydratedDocument<Verification>;
