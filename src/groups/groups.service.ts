import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsGateway } from './groups.gateway';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService, private readonly groupsGateway: GroupsGateway,) { }

  async createGroup(createGroupDto: CreateGroupDto) {
    const { name, image, userIds, movieId } = createGroupDto;

    if (!name) {
      throw new Error('Group name is required.');
    }

    if (!userIds || userIds.length === 0) {
      throw new Error('At least one user ID is required to create a group.');
    }

    const parsedUserIds = userIds.map((id) => Number(id));

    // validar ids de usuario
    const existingUsers = await this.prisma.user.findMany({
      where: { id: { in: parsedUserIds } },
      select: { id: true },
    });

    const existingUserIds = existingUsers.map((user) => user.id);
    const invalidUserIds = parsedUserIds.filter((id) => !existingUserIds.includes(id));

    if (invalidUserIds.length > 0) {
      throw new Error(`Invalid user IDs: ${invalidUserIds.join(', ')}`);
    }

    const group = await this.prisma.group.create({
      data: { name, image: image || null, movieId: movieId || null },
    });

    await this.prisma.userGroup.createMany({
      data: existingUserIds.map((userId) => ({
        userId,
        groupId: group.id,
      })),
    });

    const fullGroup = await this.prisma.group.findUnique({
      where: { id: group.id },
      include: {
        users: {
          include: { user: true },
        },
      },
    });

    this.groupsGateway.notifyGroupCreated(fullGroup, existingUserIds);

    return fullGroup;
  }


  async findAll() {
    return this.prisma.group.findMany({
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                second_name: true,
                user: true
              }
            }
          }
        }
      },
    });
  }

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                second_name: true,
                user: true
              }
            }
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (updateGroupDto.userIds?.length) {
      await Promise.all(
        updateGroupDto.userIds.map((userId) =>
          this.prisma.userGroup.create({
            data: {
              userId,
              groupId: id,
            },
          })
        )
      );

      updateGroupDto.userIds.forEach((userId) => {
        this.groupsGateway.notifyUserAddedToGroup(userId, id);
      });
    }

    if (updateGroupDto.removeUserIds?.length) {
      await Promise.all(
        updateGroupDto.removeUserIds.map((userId) =>
          this.prisma.userGroup.deleteMany({
            where: {
              userId,
              groupId: id,
            },
          })
        )
      );

      updateGroupDto.removeUserIds.forEach((userId) => {
        this.groupsGateway.notifyGroupUpdated(userId);
      });
    }

    const updatedGroup = await this.prisma.group.update({
      where: { id },
      data: {
        name: updateGroupDto.name,
        image: updateGroupDto.image,
        movieId: updateGroupDto.movieId,
      },
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
            },
          },
        },
      },
    });

    updatedGroup.users.forEach(({ userId }) => {
      this.groupsGateway.notifyGroupUpdated(userId);
    });

    return updatedGroup;
  }



  async remove(id: number) {
    const group = await this.prisma.group.findUnique({ where: { id } });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.prisma.group.delete({ where: { id } });
  }

  async addUserToGroup(groupId: number, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }

    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new Error(`Group with ID ${groupId} does not exist.`);
    }

    const existingRecord = await this.prisma.userGroup.findUnique({
      where: {
        userId_groupId: { userId, groupId },
      },
    });

    if (existingRecord) {
      throw new Error('The user is already part of this group.');
    }

    this.groupsGateway.notifyUserAddedToGroup(userId, groupId);
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
