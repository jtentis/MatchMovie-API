import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto, FindUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';


@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: 'Criar usuário'})
  @UsePipes(new ValidationPipe({ 
    transform: true, // automatically transform payload to DTO
    exceptionFactory: (errors) => new BadRequestException(errors), // customize error handling
  }))
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuários'})
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuário'})
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findOne(id));
  }

  @Get('username/:username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Procurar usuário por username'})
  async findOneByUser(@Param() findUserDto : FindUserDto) {
    const {username} = findUserDto;
    console.log('Received username parameter:', findUserDto); // Log the parameter
    return new UserEntity(await this.usersService.findOneByUser(username));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar usuário'})
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log('UpdateUserDto received:', updateUserDto); 
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir usuário'})
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }

  @Post(':id/upload-profile-picture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar foto de perfil para usuário'})
    async uploadProfilePicture(
        @Param('id', ParseIntPipe) id: number,
        @Body('profilePicture') profilePicture: string,
    ) {
        return this.usersService.updateProfilePicture(id, profilePicture);
    }

    @Get(':userId/groups')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar os grupos do usuário'})
    async listGroupsForUser(@Param('userId', ParseIntPipe) userId: number) {
      return this.usersService.listGroupsForUser(userId);
    }
}
