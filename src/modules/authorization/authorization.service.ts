import { Injectable } from '@nestjs/common';
import { roleAppPagePermission, TRole } from './authorization.constants';

@Injectable()
export class AuthorizationService {
  getAppPages(role: TRole) {
    return roleAppPagePermission.find((item) => item.role === role)?.pageIds;
  }
}
