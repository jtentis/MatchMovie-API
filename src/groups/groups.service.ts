import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
    constructor(private prisma: PrismaService) {}

    async create(createGroupDto: CreateGroupDto) {
        return this.prisma.group.create({
            data: {
                name: createGroupDto.name,
                image: createGroupDto.image,
                users: {
                    connect: createGroupDto.userIds.map((id) => ({ id })),
                },
            },
        });
    }

    async findAll() {
        return this.prisma.group.findMany({
            include: {
                users: true,
            },
        });
    }

    async findOne(id: number) {
        const group = await this.prisma.group.findUnique({
            where: { id },
            include: { users: true },
        });

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        return group;
    }

    async update(id: number, updateGroupDto: UpdateGroupDto) {
        const group = await this.prisma.group.findUnique({ where: { id } });

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        return this.prisma.group.update({
            where: { id },
            data: {
                name: updateGroupDto.name,
                image: updateGroupDto.image,
                users: {
                    connect: updateGroupDto.userIds?.map((id) => ({ id })),
                    disconnect: updateGroupDto.removeUserIds?.map((id) => ({ id })),
                },
            },
        });
    }

    async remove(id: number) {
        const group = await this.prisma.group.findUnique({ where: { id } });

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        return this.prisma.group.delete({ where: { id } });
    }

    async addUserToGroup(groupId: number, userId: number) {
      const group = await this.prisma.group.findUnique({ where: { id: groupId } });
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!group) {
          throw new NotFoundException('Group not found');
      }

      if (!user) {
          throw new NotFoundException('User not found');
      }

      return this.prisma.group.update({
          where: { id: groupId },
          data: {
              users: {
                  connect: { id: userId },
              },
          },
      });
  }

  async listUsersInGroup(groupId: number) {
    const group = await this.prisma.group.findUnique({
        where: { id: groupId },
        include: {
            users: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    second_name: true,
                    user: true,
                    profilePicture: true,
                    favorites: true,
                    watched: true
                  },
                }
              }
            }
        },
    });

    if (!group) {
        throw new NotFoundException('Group not found');
    }

    return group;
}
}
