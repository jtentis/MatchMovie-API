import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WatchedService {

constructor(private prisma: PrismaService, private readonly httpService: HttpService) { }

    async watchedMovie(userId: number, movieId: number) {
        // Verificar se o usuário existe
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException('Usuário não encontrado.');
        }
    
        // Verificar se o filme já está favoritado pelo usuário
        const alreadyWatched = await this.prisma.watched.findUnique({
          where: { userId_movieId: { userId, movieId } },
        });
        if (alreadyWatched) {
          throw new ConflictException('Filme já foi visto.');
        }
    
        // Criar o registro de visto
        await this.prisma.watched.create({
          data: {
            userId,
            movieId,
          },
        });
    
        return true;
      }
    
      async toggleWatched(userId: number, movieId: number): Promise<boolean> {
        console.log('Chegando no toggleWatched com:', { userId, movieId });
      
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException('Usuário não encontrado.');
        }
      
        const watched = await this.prisma.watched.findUnique({
          where: { userId_movieId: { userId, movieId } },
        });
      
        if (watched) {
          console.log('Desfavoritando o filme:', { userId, movieId });
          await this.prisma.watched.delete({
            where: { id: watched.id },
          });
          return false;
        } else {
          console.log('Favoritando o filme:', { userId, movieId });
          await this.prisma.watched.create({
            data: { userId, movieId },
          });
          return true;
        }
      }
      
    
      async isWatched(userId: number, movieId: number): Promise<boolean> {
        const watched = await this.prisma.watched.findUnique({
          where: { userId_movieId: { userId, movieId } },
        });
      
        return !!watched;
      }
    
}
