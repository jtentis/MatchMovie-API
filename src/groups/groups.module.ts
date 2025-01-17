import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GroupController } from './groups.controller';
import { GroupService } from './groups.service';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [PrismaModule],
  exports: [GroupService]
})
export class GroupsModule {}
