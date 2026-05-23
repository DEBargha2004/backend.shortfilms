import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';

import { AuthService } from './auth/services/auth.service';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async onModuleInit() {
    await this.seedUser();
  }

  async seedUser() {
    const admins = await this.userService.getUsersByRole('admin');
    if (!admins.length) {
      console.log('Admin user does not exist, creating one...');
      await this.authService.registerUserWithoutVerification(
        {
          name: this.configService.get<string>('ADMIN_NAME', ''),
          email: this.configService.get<string>('ADMIN_EMAIL', ''),
          password: this.configService.get<string>('ADMIN_PASSWORD', ''),
          image: '',
        },
        'admin',
      );

      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  }
}
