import { IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  userIds?: number[];
  
  @IsOptional()
  removeUserIds?: number[]; // Array of user IDs to remove from the group
}

