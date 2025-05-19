import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Credentials } from '../entities/credentials.entity';
import { Model } from 'mongoose';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectModel(Credentials.name)
    private readonly credentialsModel: Model<Credentials>,
  ) {}

  async getCredentialsByUserId(userId: string) {
    const credentials = await this.credentialsModel.findOne({ userId });
    return credentials?.toObject();
  }

  async getCredentialsByEmail(email: string) {
    const credentials = await this.credentialsModel.findOne({ email });
    return credentials?.toObject();
  }

  async createCredentials(credentials: Credentials) {
    const newCredentials = await this.credentialsModel.create(credentials);
    return newCredentials?.toObject();
  }

  async updateCredentials(
    { userId, email }: { userId?: string; email?: string },
    password: string,
  ) {
    const credentials = await this.credentialsModel.findOneAndUpdate(
      { ...(userId ? { userId } : { email }) },
      { password },
      { new: true },
    );

    return credentials?.toObject();
  }
}
