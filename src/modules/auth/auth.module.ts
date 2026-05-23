import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';
import { EmailModule } from '../email/email.module';
import { CredentialsService } from './services/credentials.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Credentials, CredentialsSchema } from './entities/credentials.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    TokenModule,
    EmailModule,
    MongooseModule.forFeature([
      { name: Credentials.name, schema: CredentialsSchema },
    ]),
    StorageModule,
  ],
  controllers: [AuthController],

  providers: [AuthService, CredentialsService],
  exports: [AuthService, CredentialsService],
})
export class AuthModule {}
