import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserIdDto } from './dto/userid-dto';
import { ErrorMessage } from 'src/libs/error';
import { StorageService } from '../storage/storage.service';
import { Auth } from '../auth/auth.guard';
import { User } from 'src/common/decorators/user';
import { TJwtToken } from 'src/types/jwt-payload';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {}

  @Auth()
  @Get()
  async getCurrentUser(@User() user: TJwtToken) {
    const res = await this.userService.getUserById(user.sub);
    console.log(res, user);
    if (!res)
      throw new HttpException(
        new ErrorMessage('USER_NOT_FOUND', 'User not found'),
        HttpStatus.NOT_FOUND,
      );

    return {
      id: res._id,
      avatar: await this.storageService.getSignedUrl(res.image),
      email: res.email,
      name: res.name,
      role: res.role,
    };
  }

  @Get('search')
  async getUsers(@Query('query') query: string) {
    const res = await this.userService.searchUsers(query);
    return res;
  }

  @Get(':id')
  async getUserInfo(@Param() params: UserIdDto) {
    const res = await this.userService.getUserById(params.id);
    return res;
  }
}
