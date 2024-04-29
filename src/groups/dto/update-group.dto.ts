import { IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  image?: string;
}
