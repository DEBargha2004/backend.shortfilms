import { Injectable } from '@nestjs/common';
import { JwtPayload, TJwtToken } from 'src/types/jwt-payload';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { TConfig } from 'src/libs/env';

@Injectable()
export class JwtTokenService {
  constructor(private readonly configService: ConfigService<TConfig>) {}

  sign(payload: JwtPayload) {
    const jwtSecret = this.configService.get('JWT_SECRET', { infer: true });

    if (!jwtSecret) throw new Error('JWT_SECRET is not defined');
    const token = jwt.sign(
      {
        sub: payload.userId,
        role: payload.role,
        email: payload.email,
      },
      jwtSecret,
    );
    return token;
  }

  static verify(token: string): TJwtToken {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) throw new Error('JWT_SECRET is not defined');
    return jwt.verify(token, jwtSecret) as TJwtToken;
  }
}
