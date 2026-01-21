import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EnvService } from 'src/env.service';

@Module({
  providers: [EmailService, EnvService],
  exports: [EmailService],
})
export class EmailModule {}
