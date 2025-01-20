import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  image?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  @ApiProperty()
  userIds: number[];

  @IsOptional()
  @ApiProperty({description: 'ID do filme de referencia do grupo'})
  movieId?: number;
}

