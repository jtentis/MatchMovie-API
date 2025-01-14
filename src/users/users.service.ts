import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        favorites: {},
        watched: {},
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Fetch the current user data
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });
  
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  
    // Merge the provided fields with the existing user data
    const updatedData = {
      ...existingUser,
      ...updateUserDto,
    };
  
    // Handle password hashing if password is provided
    if (updateUserDto.password) {
      updatedData.password = await bcrypt.hash(updateUserDto.password, roundsOfHashing);
    }
  
    // Update the user in the database
    return this.prisma.user.update({
      where: { id },
      data: updatedData,
      include: {
        favorites: true,
        watched: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
