import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  image?: string;

  @IsNotEmpty()
  @ApiProperty()
  userIds: number[]; // Array of user IDs to associate with the group
}

