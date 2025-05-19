import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { SignInDto } from '../dto/signin-dto';
import * as bcrypt from 'bcryptjs';
import { JwtTokenService } from '../../token/jwt/token.service';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { EmailService } from '../../email/email.service';
import { VerificationService } from '../../token/verification/verification.service';
import VerificationTemplate from '../../email/templates/verification';
import { TDefaultUser } from '../../user/user.entity';
import { CredentialsService } from './credentials.service';
import { PasswordResetService } from 'src/modules/token/password-reset/password-reset.service';
import PasswordResetTemplate from 'src/modules/email/templates/password-reset';
import { PasswordResetDto } from '../dto/password-reset';
import { ErrorMessage } from 'src/libs/error';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: JwtTokenService,
    private readonly emailService: EmailService,
    private readonly verificationService: VerificationService,
    private readonly credentialsService: CredentialsService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  async signin(credentials: SignInDto) {
    const userCredentials = await this.credentialsService.getCredentialsByEmail(
      credentials.email,
    );

    if (!userCredentials)
      throw new HttpException(
        new ErrorMessage('USER_NOT_FOUND', 'User not found'),
        HttpStatus.NOT_FOUND,
      );

    const isPasswordMatch = await bcrypt.compare(
      credentials.password,
      userCredentials.password,
    );
    if (!isPasswordMatch)
      throw new HttpException(
        new ErrorMessage('INVALID_CREDENTIALS', 'Invalid password'),
        HttpStatus.UNAUTHORIZED,
      );

    const userProfile = await this.userService.getUserById(
      userCredentials.userId.toString(),
    );
    if (!userProfile?.isVerified)
      throw new HttpException(
        new ErrorMessage('USER_NOT_VERIFIED', 'User not verified'),
        HttpStatus.UNAUTHORIZED,
      );

    const token = this.tokenService.sign({
      userId: userCredentials.userId.toString(),
      role: 'user',
      email: userCredentials.email,
    });

    return { token, userProfile };
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.getUserByEmail(
      createUserDto.email,
    );
    if (existingUser)
      throw new HttpException(
        new ErrorMessage('DUPLICATE_USER', 'User already exists'),
        HttpStatus.BAD_REQUEST,
      );

    const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userService.createUser({
      email: createUserDto.email,
      name: createUserDto.name,
      image: createUserDto.image,
      isVerified: false,
    });

    await this.credentialsService.createCredentials({
      userId: newUser._id,
      email: createUserDto.email,
      password: encryptedPassword,
    });

    return newUser;
  }

  async sendVerificationEmail(user: TDefaultUser) {
    const verificationToken =
      await this.verificationService.createVerificationToken(
        user._id.toString(),
      );

    const mailTemplate = await this.emailService.generateTemplate(
      VerificationTemplate,
      { token: verificationToken.token },
    );

    await this.emailService.sendMail(mailTemplate, user.email);
  }

  async verifyAccount(token: string) {
    const verification =
      await this.verificationService.checkVerification(token);
    if (!verification?._id)
      throw new HttpException(
        new ErrorMessage('INVALID_TOKEN', 'Invalid token'),
        HttpStatus.BAD_REQUEST,
      );

    await this.verificationService.deleteVerificationToken(token);
    await this.userService.setUserVerification(
      verification.userId.toString(),
      true,
    );

    return !!verification._id;
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user)
      throw new HttpException(
        new ErrorMessage('USER_NOT_FOUND', 'User not found'),
        HttpStatus.NOT_FOUND,
      );

    const passwordReset =
      await this.passwordResetService.createResetPasswordToken(
        user._id.toString(),
      );
    const mailTemplate = await this.emailService.generateTemplate(
      PasswordResetTemplate,
      { token: passwordReset.token },
    );

    await this.emailService.sendMail(mailTemplate, email);
  }

  async resetPassword(passwordReset: PasswordResetDto) {
    const tokenOwner = await this.passwordResetService.getTokenOwner(
      passwordReset.token,
    );
    if (!tokenOwner)
      throw new HttpException(
        new ErrorMessage('INVALID_TOKEN', 'Invalid token'),
        HttpStatus.BAD_REQUEST,
      );

    const encryptedPassword = await bcrypt.hash(passwordReset.password, 10);

    await this.credentialsService.updateCredentials(
      { email: tokenOwner.email },
      encryptedPassword,
    );

    this.passwordResetService.deleteResetPasswordToken({
      email: tokenOwner.email,
    });
  }
}
