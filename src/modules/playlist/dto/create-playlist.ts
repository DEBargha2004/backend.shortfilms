import { IsOptional, IsString } from 'class-validator';

export class PlaylistCreateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;
}
