import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  image: string;
}
