import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString} from 'class-validator';

export class CreateAssistidosDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  data_assistido: Date;

}