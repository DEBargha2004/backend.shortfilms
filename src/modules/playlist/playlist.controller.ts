import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PlaylistCreateDto } from './dto/create-playlist';
import { PlaylistService } from './playlist.service';
import { User } from 'src/common/decorators/user';
import { JwtPayload, TJwtToken } from 'src/types/jwt-payload';
import { UpdatePlaylistAuthorizedGuard } from './guards/update-playlist';
import { Auth, AuthGuard } from '../auth/auth.guard';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Auth('playlist.create')
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() body: PlaylistCreateDto, @User() user: TJwtToken) {
    const res = await this.playlistService.createPlaylist(body, user.sub);
    return {
      message: 'Playlist created successfully',
      data: {
        id: res._id,
        name: res.name,
      },
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(@User() user: TJwtToken) {
    const res = await this.playlistService.getPlaylistsofUser(user.sub);
    return {
      data: res.map((p) => ({
        id: p._id,
        name: p.name,
      })),
    };
  }

  @UseGuards(AuthGuard, UpdatePlaylistAuthorizedGuard)
  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  async updatePost(payload: PlaylistCreateDto, @User() user: TJwtToken) {}
}
