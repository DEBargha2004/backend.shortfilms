import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserIdDto } from './dto/userid-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types/request';
import { ErrorMessage } from 'src/libs/error';
import { StorageService } from '../storage/storage.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCurrentUser(@Req() req: AuthenticatedRequest) {
    const res = await this.userService.getUserById(req.user.userId);

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
