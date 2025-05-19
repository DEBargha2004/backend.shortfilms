import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  constructor() {}

  generateOtp(length: number) {
    const multiplier = Math.pow(10, length);
    return Math.floor(Math.random() * multiplier)
      .toString()
      .padStart(length, '0');
  }
}
