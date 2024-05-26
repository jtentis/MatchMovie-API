import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  genero: string;


}
