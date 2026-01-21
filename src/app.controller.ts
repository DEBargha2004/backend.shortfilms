import { Controller, Get, Request } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health(@Request() req: Request): string {
    return 'OK';
  }
}
