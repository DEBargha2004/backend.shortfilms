import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SignInDto } from './dto/signin-dto';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { AccountVerificationDto } from './dto/account-verification';
import { PasswordResetDto, PasswordResetTokenDto } from './dto/password-reset';
import type { Response } from 'express';
import { StorageService } from '../storage/storage.service';
import { EnvService } from 'src/env.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly storageService: StorageService,
    private readonly envService: EnvService,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.authService.signin(body);

    res.cookie('jwt', payload.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.envService.get('NODE_ENV') === 'production',
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    return {
      message: 'Signin successful',
      data: {
        id: payload.userProfile._id,
        email: payload.userProfile.email,
        avatar: await this.storageService.getSignedUrl(
          payload.userProfile.image,
        ),
        name: payload.userProfile.name,
      },
    };
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: CreateUserDto) {
    const payload = await this.authService.createUser(body);
    this.authService.sendVerificationEmail(payload);

    return {
      message: 'User created successfully',
    };
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.envService.get('NODE_ENV') === 'production',
      path: '/',
    });

    return {
      message: 'Signout successful',
    };
  }

  @Post('account-verification')
  @HttpCode(HttpStatus.OK)
  async accountVerification(@Body() body: AccountVerificationDto) {
    await this.authService.verifyAccount(body.token);

    return {
      message: 'Account verification successful',
    };
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async getChangePasswordToken(@Body() body: PasswordResetTokenDto) {
    await this.authService.sendPasswordResetEmail(body.email);

    return {
      message: 'Password reset token sent successfully',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: PasswordResetDto) {
    await this.authService.resetPassword(body);

    return {
      message: 'Password reset successful',
    };
  }
}
