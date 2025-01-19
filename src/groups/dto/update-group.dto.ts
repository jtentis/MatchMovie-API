import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @ApiProperty({ description:'Nome'})
  name?: string;

  @IsOptional()
  @ApiProperty({ description:'Imagem em base64'})
  image?: string;

  @IsOptional()
  @ApiProperty({ description:'Array de IDs de usuários'})
  userIds?: number[];
  
  @IsOptional()
  @ApiProperty({ description:'Array para remover usuarios'})
  removeUserIds?: number[]; // Array of user IDs to remove from the group

  @IsOptional()
  @ApiProperty({ description: 'ID do filme de referencia do grupo' })
  movieId?: number;
}

