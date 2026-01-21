import { IsMongoId, IsNotEmpty, Length } from 'class-validator';

export class AccountVerificationDto {
  @IsNotEmpty()
  @Length(6)
  token: string;
}
