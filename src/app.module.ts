import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FavoritesModule } from './favorites/favorites.module';
import { GroupsModule } from './groups/groups.module';
import { IngressoController } from './ingresso/ingresso.controller';
import { IngressoModule } from './ingresso/ingresso.module';
import { IngressoService } from './ingresso/ingresso.service';
import { MatchModule } from './match/match.module';
import { MoviesModule } from './movies/movies.module';
import { PrismaModule } from './prisma/prisma.module';
import { WatchedModule } from './watched/watched.module';
import { GeolocationModule } from './geolocation/geolocation.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, GroupsModule, FavoritesModule, WatchedModule, MatchModule, IngressoModule, HttpModule, GeolocationModule],
  controllers: [AppController, IngressoController],
  providers: [AppService, IngressoService],
})
export class AppModule {}
