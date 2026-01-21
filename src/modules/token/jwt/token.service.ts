import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/types/jwt-payload';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtTokenService {
  constructor() {}

  sign(payload: JwtPayload) {
    const token = jwt.sign(
      {
        sub: payload.userId,
        role: payload.role,
        email: payload.email,
      },
      process.env.JWT_SECRET,
    );
    return token;
  }
}
