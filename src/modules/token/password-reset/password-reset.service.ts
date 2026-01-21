import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResetPassword } from './password-reset.entity';
import { Model } from 'mongoose';
import { OtpService } from '../otp/otp.service';
import { User } from 'src/modules/user/user.entity';
import { Doc } from 'src/types/doc';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectModel(ResetPassword.name)
    private readonly resetPasswordModel: Model<ResetPassword>,
    private readonly otpService: OtpService,
  ) {}

  async createResetPasswordToken(userId: string) {
    const token = this.otpService.generateOtp(6);
    const resetPassword = await this.resetPasswordModel.create({
      userId,
      token,
    });

    return resetPassword.toObject();
  }

  async getResetPasswordToken(token: string) {
    const resetPasswordToken = await this.resetPasswordModel.findOne({
      token,
    });
    return resetPasswordToken?.toObject();
  }

  async deleteResetPasswordToken({
    email,
    userId,
  }: {
    userId?: string;
    email?: string;
  }) {
    await this.resetPasswordModel.deleteMany({
      ...(userId ? { userId } : { email }),
    });
  }

  async getTokenOwner(token: string) {
    let tokenObj = await this.resetPasswordModel
      .findOne({ token })
      .populate<{ user: Doc<User> }>('user')
      .exec();

    return tokenObj?.user;
  }
}
