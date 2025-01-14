import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FavoriteMovieDto {
  @IsNotEmpty()
  @ApiProperty({description: 'ID do usuário para receber o filme favoritado', example: 2})
  userId: number;

  @IsNotEmpty()
  @ApiProperty({description: 'ID do filme para favoritar'})
  movieId: number;
}
