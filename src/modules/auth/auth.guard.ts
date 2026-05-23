import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TPermission } from '../authorization/authorization.constants';
import {
  PermissionGuard,
  Permissions,
} from '../authorization/authorization.guard';
import { JwtTokenService } from '../token/jwt/token.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.cookies['user'] ?? '';

    const isJwtValid = JwtTokenService.verify(authHeader);

    if (isJwtValid) {
      request.user = isJwtValid;
      return true;
    }

    throw new UnauthorizedException('Invalid token');
  }
}

export const Auth = (...permissions: TPermission[]) => {
  return applyDecorators(
    UseGuards(AuthGuard, PermissionGuard),
    Permissions(...permissions),
  );
};
