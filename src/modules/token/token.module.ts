import { Module } from '@nestjs/common';
import { JwtTokenService } from './jwt/token.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Verification,
  VerificationSchema,
} from './verification/verification.entity';
import { VerificationService } from './verification/verification.service';
import { OtpService } from './otp/otp.service';
import { PasswordResetService } from './password-reset/password-reset.service';
import {
  ResetPassword,
  ResetPasswordSchema,
} from './password-reset/password-reset.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
      { name: ResetPassword.name, schema: ResetPasswordSchema },
    ]),
  ],
  providers: [
    JwtTokenService,
    VerificationService,
    OtpService,
    PasswordResetService,
  ],
  exports: [JwtTokenService, VerificationService, PasswordResetService],
})
export class TokenModule {}
