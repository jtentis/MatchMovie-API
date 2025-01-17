import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './groups.service';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.remove(id);
  }

  @Post(':groupId/users/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addUserToGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.groupService.addUserToGroup(groupId, userId);
  }

  @Get(':groupId/users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async listUsersInGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupService.listUsersInGroup(groupId);
  }
}
