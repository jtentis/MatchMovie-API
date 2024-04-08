import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './database/app.service';
import { PrismaService } from './database/prisma.service';
import { randomUUID } from 'crypto';
import { CreateTeamMemberBody } from './dto/create-team-member-body';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) { }

  @Get()
  async getHello(@Body() body: CreateTeamMemberBody) {
    console.log(body)
    const { name, function: doingFunction} = body

    const member = await this.prisma.membersMatchMovie.create({
      data :{
        id: randomUUID(),
        name: name,
        function: doingFunction
      }
    })

    return member
  }
}
