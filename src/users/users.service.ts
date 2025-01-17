import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
      select: {
        id: true,
        name: true,
        second_name: true,
        user: true,
        profilePicture: true,
        favorites: true,
        watched: true
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    const updatedData = {
      ...existingUser,
      ...updateUserDto,
    };

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

  async updateProfilePicture(userId: number, profilePicture: string) {
    if (!profilePicture) {
      throw new UnauthorizedException('Escolha uma imagem.');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { profilePicture },
    });
  }

  async listGroupsForUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        groups: {
          include: {
            group: true, // Fetch details of the group
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.groups.map((userGroup) => userGroup.group);
  }
}
