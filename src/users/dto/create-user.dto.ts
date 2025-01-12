// src/users/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  second_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
<<<<<<< HEAD
  @MinLength(6)
  @ApiProperty()
  conf_password: string;

  @IsString()
  @IsNotEmpty()
=======
>>>>>>> 7e7c17ed359c757ebafa80a9ddaa65739cda9c4e
  @MinLength(11)
  @ApiProperty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location_number: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> 7e7c17ed359c757ebafa80a9ddaa65739cda9c4e
