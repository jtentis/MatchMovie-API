import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsGateway } from './groups.gateway';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService, private readonly groupsGateway: GroupsGateway,) { }

  async createGroup(createGroupDto: CreateGroupDto) {
    const { name, image, userIds } = createGroupDto;
  
    // Validate user IDs
    const existingUsers = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });
  
    const existingUserIds = existingUsers.map((user) => user.id);
    const invalidUserIds = userIds.filter((id) => !existingUserIds.includes(id));
  
    if (invalidUserIds.length > 0) {
      throw new Error(`Invalid user IDs: ${invalidUserIds.join(', ')}`);
    }
  
    // Create the group
    const group = await this.prisma.group.create({
      data: { name, image },
    });
  
    // Link users to the group
    await Promise.all(
      existingUserIds.map((userId) =>
        this.prisma.userGroup.create({
          data: { userId, groupId: group.id },
        })
      )
    );
  
    // Return the group with its users
    return this.prisma.group.findUnique({
      where: { id: group.id },
      include: {
        users: {
          include: { user: true },
        },
      },
    });
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
      include: { users: true },
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
  
    // Handle adding and removing users in separate steps
    const addUserOperations = updateGroupDto.userIds?.map((userId) => ({
      user: { connect: { id: userId } }, // Ensure the user exists
    }));
  
    const removeUserOperations = updateGroupDto.removeUserIds?.map((userId) => ({
      userId,
      groupId: id,
    }));
  
    // Add users to the group
    if (addUserOperations?.length) {
      await Promise.all(
        addUserOperations.map((data) =>
          this.prisma.userGroup.create({
            data: {
              userId: data.user.connect.id,
              groupId: id,
            },
          })
        )
      );
    }
  
    // Remove users from the group
    if (removeUserOperations?.length) {
      await Promise.all(
        removeUserOperations.map((data) =>
          this.prisma.userGroup.deleteMany({
            where: {
              userId: data.userId,
              groupId: data.groupId,
            },
          })
        )
      );
    }
  
    // Update group details (e.g., name, image)
    return this.prisma.group.update({
      where: { id },
      data: {
        name: updateGroupDto.name,
        image: updateGroupDto.image,
      },
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
  }
  

  async remove(id: number) {
    const group = await this.prisma.group.findUnique({ where: { id } });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.prisma.group.delete({ where: { id } });
  }

  async addUserToGroup(groupId: number, userId: number) {
    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }
  
    // Check if the group exists
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
  
    if (!group) {
      throw new Error(`Group with ID ${groupId} does not exist.`);
    }
  
    // Check if the user is already part of the group
    const existingRecord = await this.prisma.userGroup.findUnique({
      where: {
        userId_groupId: { userId, groupId }, // Composite key lookup
      },
    });
  
    if (existingRecord) {
      throw new Error('The user is already part of this group.');
    }
  
    this.groupsGateway.notifyUserAddedToGroup(userId, groupId);
    // Create a new record
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
