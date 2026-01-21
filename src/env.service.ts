import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TEnvSchema } from './libs/env';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  get(key: keyof TEnvSchema): TEnvSchema[keyof TEnvSchema] {
    const value = this.configService.get(key);
    return value;
  }
}
