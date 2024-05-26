import { PartialType } from '@nestjs/swagger';
import { CreateAssistidosDto } from './create-assistidos.dto';

export class UpdateUserDto extends PartialType(CreateAssistidosDto) {}