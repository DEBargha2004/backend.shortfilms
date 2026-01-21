import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  ValidateNested,
  IsString,
  IsDate,
  IsBoolean,
  ValidateIf,
  IsArray,
  ArrayNotEmpty,
  IsMongoId,
  IsOptional,
  IsDateString,
} from 'class-validator';

class Video {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Type of the video',
  })
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional path of the video',
  })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional library Id',
  })
  @IsOptional()
  @IsString()
  libraryId: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional external URL for the video',
  })
  @IsOptional()
  @IsString()
  href?: string;
}

class Pricing {
  @ApiProperty({
    type: Boolean,
    description: 'Whether the content is paid or free',
  })
  @IsBoolean()
  isPaid: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Price of the content, required if isPaid is true',
  })
  @ValidateIf((o) => o.isPaid === true)
  @IsNotEmpty()
  price?: string;
}
class Metadata {
  @ApiProperty({
    description: 'Duration of the video (e.g., 1h 30m)',
    example: '1h 30m',
  })
  @IsNotEmpty()
  @IsString()
  duration: string;

  @ApiProperty({
    description: 'Country of origin',
    example: 'India',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Language of the video',
    example: 'English',
  })
  @IsNotEmpty()
  @IsString()
  language: string;

  @ApiProperty({
    description: 'Premiere status of the video',
    example: 'World Premiere',
  })
  @IsNotEmpty()
  @IsString()
  premiereStatus: string;

  @ApiProperty({
    description: 'Date of completion',
    example: new Date(),
    type: String, // Swagger renders dates as strings,
  })
  @IsNotEmpty()
  @IsDateString()
  completionDate: Date;

  @ApiProperty({
    description: 'Age rating of the video',
    example: 'PG-13',
  })
  @IsNotEmpty()
  @IsString()
  ageRating: string;

  @ApiProperty({
    description: 'Pricing details',
    type: () => Pricing,
  })
  @ValidateNested()
  @Type(() => Pricing)
  pricing: Pricing;

  @ApiProperty({
    description: 'Software used in production',
    example: ['Blender', 'Adobe Premiere Pro'],
    type: String,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  softwareUsed: string[];
}

class Categories {
  @ApiProperty({
    description: 'Genres of the content',
    example: ['Drama', 'Action'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  genres: string[];

  @ApiProperty({
    description: 'Animation or film techniques used',
    example: ['2D', 'Stop Motion'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  techniques: string[];

  @ApiProperty({
    description: 'Custom tags to describe the content',
    example: ['Award-winning', 'Short film'],
    type: String,
    isArray: true,
  })
  @IsArray()
  tags: string[];
}

class SchedulingOption {
  @IsBoolean()
  isScheduled: boolean;

  @ValidateIf((o) => o.isScheduled === true)
  @IsDate()
  publishDate?: Date;
}

class Credit {
  @ApiProperty({ type: String, description: 'MongoDB ObjectId of the credit' })
  @IsMongoId()
  id: string;

  @ApiProperty({ type: String, description: 'Name of the person credited' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: 'Role or responsibility' })
  @IsNotEmpty()
  @IsString()
  role: string;
}

class PublishingOption {
  @ApiProperty({
    type: Boolean,
    description: 'Whether copyright permission is granted',
  })
  @IsBoolean()
  copyrightPermission: boolean;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Type of publishing selected',
  })
  @IsNotEmpty()
  @IsString()
  publishType: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional password for protected publishing',
  })
  @IsString()
  password?: string;
}

class Press {
  @ApiProperty({
    type: String,
    required: true,
    description: 'URL of the press release or article',
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Title of the press release or article',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Description of the press release or article',
  })
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional logo URL for the press release or article',
  })
  @IsString()
  logo?: string;
}

export class CreatePostDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: Video })
  @ValidateNested()
  @Type(() => Video)
  video: Video;

  @ApiProperty({ type: Video })
  @ValidateNested()
  @Type(() => Video)
  trailer: Video;

  @ApiProperty({ type: Metadata })
  @ValidateNested()
  @Type(() => Metadata)
  details: Metadata;

  @ApiProperty({ type: Categories })
  @ValidateNested()
  @Type(() => Categories)
  categories: Categories;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsString({ each: true })
  playlist: string[];

  @ApiProperty({ type: String })
  @IsString()
  thumbnail: string;

  @ApiProperty({ type: Credit, isArray: true, example: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Credit)
  credits: Credit[];

  @ApiProperty({ type: PublishingOption })
  @ValidateNested()
  @Type(() => PublishingOption)
  publishingOption: PublishingOption;

  @ApiProperty({ type: SchedulingOption })
  @ValidateNested()
  @Type(() => SchedulingOption)
  schedulingOption: SchedulingOption;

  @ApiProperty({ type: Press, isArray: true, example: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Press)
  press: Press[];
}
