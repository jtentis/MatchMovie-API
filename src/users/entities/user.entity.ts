// src/users/entities/user.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  second_name: string;

  @ApiProperty()
  user: string;

  @ApiProperty()
  conf_password: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  location_number: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;
}
