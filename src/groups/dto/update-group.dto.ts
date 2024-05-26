import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';

export class UpdateGroupDto extends Partialtype(CreateGroupDto){}