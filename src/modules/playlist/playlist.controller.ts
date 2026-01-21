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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/common/decorators/user';
import { JwtPayload } from 'src/types/jwt-payload';
import { UpdatePlaylistAuthorizedGuard } from './guards/update-playlist';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() body: PlaylistCreateDto, @User() user: JwtPayload) {
    const res = await this.playlistService.createPlaylist(body, user.userId);
    return {
      message: 'Playlist created successfully',
      data: {
        id: res._id,
        name: res.name,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(@User() user: JwtPayload) {
    const res = await this.playlistService.getPlaylistsofUser(user.userId);
    return {
      data: res.map((p) => ({
        id: p._id,
        name: p.name,
      })),
    };
  }

  @UseGuards(JwtAuthGuard, UpdatePlaylistAuthorizedGuard)
  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  async updatePost(payload: PlaylistCreateDto, @User() user: JwtPayload) {}
}
