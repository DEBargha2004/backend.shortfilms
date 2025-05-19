import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private async updateUser(id: string, updateUserDto: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: updateUserDto,
      },
      { new: true },
    );
    return user?.toObject();
  }

  async createUser(createUser: User) {
    const user = await this.userModel.create(createUser);
    return user?.toObject();
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user?.toObject();
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    return user?.toObject();
  }

  async setUserVerification(userId: string, status: boolean) {
    const user = await this.updateUser(userId, { isVerified: status });
    return user;
  }
}
