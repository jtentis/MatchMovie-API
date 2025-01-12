import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';
import { GroupsService } from './groups.service';


@Controller('groups')
@ApiTags('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Post()
  @ApiCreatedResponse({ type: GroupEntity })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  async findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GroupEntity })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return await this.groupsService.findOne(parseInt(id), req);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto, @Req() req: Request) {
    return this.groupsService.update(parseInt(id), updateGroupDto, req);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Req() req: Request) {
    return this.groupsService.remove(parseInt(id), req);
  }
}
