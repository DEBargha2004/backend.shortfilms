import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/modules/user/user.entity';

@Schema({ timestamps: true })
export class ResetPassword {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  token: string;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);
ResetPasswordSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 60 });

export type ResetPasswordDocument = HydratedDocument<ResetPassword>;
