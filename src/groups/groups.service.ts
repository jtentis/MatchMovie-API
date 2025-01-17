import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) { }

  async create(createGroupDto: CreateGroupDto) {
    const { name, image, userIds } = createGroupDto;

    if (!userIds || userIds.length === 0) {
        throw new Error("O grupo deve ter pelo menos 1 usuário!");
    }

    const existingUsers = await this.prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true },
    });

    const existingUserIds = existingUsers.map((user) => user.id);
    const invalidUserIds = userIds.filter((id) => !existingUserIds.includes(id));

    if (invalidUserIds.length > 0) {
        throw new Error(`IDs inválidos: ${invalidUserIds.join(", ")}`);
    }

    const group = await this.prisma.group.create({
        data: {
            name,
            image,
        },
    });

    const userGroupPromises = existingUserIds.map((userId) =>
        this.prisma.userGroup.create({
            data: {
                userId,
                groupId: group.id,
            },
        })
    );
    await Promise.all(userGroupPromises);

    return this.prisma.group.findUnique({
        where: { id: group.id },
        include: {
            users: true,
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
    const group = await this.prisma.group.findUnique({
        where: { id: groupId },
    });
    if (!group) {
        throw new NotFoundException('Group not found');
    }

    const user = await this.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new NotFoundException('User not found');
    }

    return this.prisma.userGroup.create({
        data: {
            userId,
            groupId,
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
