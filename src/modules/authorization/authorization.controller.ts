import { Controller, Get } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';

import { User } from 'src/common/decorators/user';
import { Auth } from '../auth/auth.guard';
import { TJwtToken } from 'src/types/jwt-payload';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Auth()
  @Get('/app-pages')
  getAppPages(@User() user: TJwtToken) {
    return this.authorizationService.getAppPages(user.role);
  }
}
