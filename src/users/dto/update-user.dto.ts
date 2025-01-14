import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ required: false, example:'' })
  @IsOptional()
  @IsString()
  second_name?: string;

  @ApiProperty({ required: false, example:'' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, example:'' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({ required: false, example:'' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, example:'' })
  @IsOptional()
  @IsString()
  password?: string;
}
