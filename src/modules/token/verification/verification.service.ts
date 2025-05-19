import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Verification } from './verification.entity';
import { Model } from 'mongoose';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(Verification.name)
    private readonly verificationModel: Model<Verification>,
    private readonly otpService: OtpService,
  ) {}

  async createVerificationToken(userId: string) {
    const token = this.otpService.generateOtp(6);
    const verification = await this.verificationModel.create({
      userId,
      token,
    });

    return verification.toObject();
  }

  async getVerificationToken(token: string) {
    const verification = await this.verificationModel.findOne({ token });
    return verification;
  }

  async checkVerification(token: string) {
    const verification = await this.getVerificationToken(token);
    return verification?.toObject();
  }

  async deleteVerificationToken(token: string) {
    await this.verificationModel.deleteMany({ token });
  }
}
