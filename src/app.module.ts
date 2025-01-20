import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FavoritesModule } from './favorites/favorites.module';
import { GroupsModule } from './groups/groups.module';
import { MatchModule } from './match/match.module';
import { MoviesModule } from './movies/movies.module';
import { PrismaModule } from './prisma/prisma.module';
import { WatchedModule } from './watched/watched.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, GroupsModule, FavoritesModule, WatchedModule, MatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
