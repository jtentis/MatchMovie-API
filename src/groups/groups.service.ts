import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity'; 

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto) {
    return this.prisma.group.create({ data: createGroupDto });
  }

  async findAll() {
    return this.prisma.group.findMany();
  }

  async findOne(id: number, req: Request) {
    const user = req.user as UserEntity; 
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!group) {
      throw new NotFoundException('Grupo não encontrado');
    }

    if (!group.users.some(u => u.id === user.id)) { 
      throw new ForbiddenException('Você não tem permissão para acessar este grupo');
    }

    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto, req: Request) {
    const user = req.user as UserEntity; 
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!group) {
      throw new NotFoundException('Grupo não encontrado');
    }

    if (!group.users.some(u => u.id === user.id)) { 
      throw new ForbiddenException('Você não tem permissão para atualizar este grupo');
    }

    return this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
    });
  }

  async remove(id: number, req: Request) {
    const user = req.user as UserEntity; 
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!group) {
      throw new NotFoundException('Grupo não encontrado');
    }

    if (!group.users.some(u => u.id === user.id)) { 
      throw new ForbiddenException('Você não tem permissão para excluir este grupo');
    }

    return this.prisma.group.delete({ where: { id } });
  }
}
