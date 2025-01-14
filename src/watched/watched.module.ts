import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WatchedController } from './watched.controller';
import { WatchedService } from './watched.service';

@Module({
  controllers: [WatchedController],
  providers: [WatchedService],
  imports: [PrismaModule, HttpModule],
  exports: [WatchedService]
})
export class WatchedModule {}
