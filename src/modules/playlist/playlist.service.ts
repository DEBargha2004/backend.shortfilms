import { Inject, Injectable } from '@nestjs/common';
import { PlaylistCreateDto } from './dto/create-playlist';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist } from './entities/playlist.entity';
import { Model } from 'mongoose';
import { User } from '../user/user.entity';
import { Doc } from 'src/types/doc';
import { ErrorMessage } from 'src/libs/error';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Playlist.name) private readonly playlistModel: Model<Playlist>,
  ) {}

  async createPlaylist(payload: PlaylistCreateDto, ownerId: string) {
    const playlistsOfUser = await this.getPlaylistsofUser(ownerId);
    const ifSameName = playlistsOfUser.find((p) => p.name === payload.name);

    if (ifSameName)
      throw new ErrorMessage('DUPLICATE_PLAYLIST', 'Playlist already exists');

    const res = await this.playlistModel.create({
      name: payload.name,
      owner: ownerId,
      posts: [],
    });

    return res.toObject();
  }

  async updatePlaylist(payload: PlaylistCreateDto) {}

  async getPlaylistsofUser(userId: string) {
    const playlists = await this.playlistModel
      .find({
        owner: userId,
      })
      .populate<{ owner: Doc<User> }>('owner')
      .exec();

    return playlists.map((p) => p.toObject());
  }

  async getPlaylistById(id: string) {
    const playlist = await this.playlistModel
      .findById(id)
      .populate<{ owner: Doc<User> }>('owner')
      .exec();
    return playlist?.toObject();
  }
}
