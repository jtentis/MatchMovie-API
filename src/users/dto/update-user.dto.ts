import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  user?: string;

  @ApiProperty({ required: false, example:'' })
  @IsOptional()
  @IsString()
  second_name?: string;
}
