import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class MicroserviceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const headers = request.headers;

    const microserviceToken = headers['x-video-microservice-token'];
    return microserviceToken === process.env.VIDEO_MICROSERVICE_TOKEN;
  }
}
