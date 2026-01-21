import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'src/types/jwt-payload';
import { Request } from 'express';

const cookieExtractor = (req: Request) => {
  return req.cookies?.['jwt'] ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  validate(payload: any) {
    return {
      userId: payload.sub,
      role: payload.role,
      email: payload.email,
    } as JwtPayload;
  }
}
