import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GroupController } from './groups.controller';
import { GroupsGateway } from './groups.gateway';
import { GroupService } from './groups.service';

@Module({
  controllers: [GroupController],
  providers: [GroupService, GroupsGateway],
  imports: [PrismaModule],
  exports: [GroupService]
})
export class GroupsModule {}
