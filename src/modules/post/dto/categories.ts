import { IsArray, IsString } from 'class-validator';

export class CreatePostCategoriesDto {
  @IsArray()
  @IsString({ each: true })
  data: string[];
}
