import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getFields } from 'src/libs/query';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly storageService: StorageService,
  ) {}

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

  async searchUsers(query: string) {
    // await new Promise((res, rej) => {
    //   setTimeout(res, 3000);
    // });
    const res = await this.userModel
      .find({
        $text: {
          $search: query,
        },
        $and: [
          {
            isVerified: true,
          },
        ],
      })
      .select(getFields<UserDocument>(['name', 'email', '_id', 'image']))
      .limit(10);

    const users = res.map((user) => user.toObject());
    return await Promise.all(
      users.map(async (user) => ({
        ...user,
        image: await this.storageService.getSignedUrl(user.image),
      })),
    );
  }

  async setUserVerification(userId: string, status: boolean) {
    const user = await this.updateUser(userId, { isVerified: status });
    return user;
  }
}
