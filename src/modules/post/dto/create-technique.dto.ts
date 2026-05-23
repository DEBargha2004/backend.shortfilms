import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTechniqueDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
