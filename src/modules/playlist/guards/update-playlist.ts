import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PlaylistService } from '../playlist.service';
import { JwtPayload } from 'src/types/jwt-payload';
import { Request } from 'express';

@Injectable()
export class UpdatePlaylistAuthorizedGuard implements CanActivate {
  constructor(private readonly playlistService: PlaylistService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as JwtPayload;
    const playlistId = req.params.id;

    if (user.role === 'admin') return true;

    const playlist = await this.playlistService.getPlaylistById(playlistId);
    if (!playlist?._id) throw new ForbiddenException('Playlist not found');

    if (playlist.owner._id !== user.userId)
      throw new ForbiddenException('Access denied');

    return true;
  }
}
