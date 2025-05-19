import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordResetTokenDto {
  @IsEmail()
  email: string;
}

export class PasswordResetDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  password: string;
}
