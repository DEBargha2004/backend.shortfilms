import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((_, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
