import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_PERMISSION_LIST, TPermission } from './authorization.constants';
import { TJwtToken } from 'src/types/jwt-payload';

const PERMISSION_KEY = 'permissions';
export const Permissions = (...permissions: TPermission[]) =>
  SetMetadata(PERMISSION_KEY, permissions);

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let requiredPermissions = this.reflector.getAll<TPermission[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    requiredPermissions = requiredPermissions
      .flat()
      .filter((p) => p !== undefined);

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as TJwtToken;

    const role = user.role;
    const rolePermissions = ROLE_PERMISSION_LIST.find((rp) => rp.role === role);

    if (!rolePermissions) return false;

    for (const p of requiredPermissions) {
      //@ts-ignore
      if (!rolePermissions.permissions.includes(p)) {
        return false;
      }
    }

    return true;
  }
}
