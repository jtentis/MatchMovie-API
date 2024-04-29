import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
