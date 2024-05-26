import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

}
