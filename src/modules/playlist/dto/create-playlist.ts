import { IsString } from 'class-validator';

export class PlaylistCreateDto {
  @IsString()
  name: string;
}
