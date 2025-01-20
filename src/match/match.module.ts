import { Module, forwardRef } from '@nestjs/common';
import { GroupsModule } from 'src/groups/groups.module';
import { GroupsGateway } from '../groups/groups.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
    imports: [PrismaModule, forwardRef(() => GroupsModule)], // Use forwardRef if necessary
    providers: [MatchService, GroupsGateway],
    exports: [MatchService],
    controllers: [MatchController],
})
export class MatchModule {}
