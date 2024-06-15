import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [PrismaModule, MoviesModule, HttpModule],
  exports: [MoviesService]
})
export class MoviesModule {}
