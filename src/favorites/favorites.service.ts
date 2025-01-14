import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {

    constructor(private prisma: PrismaService, private readonly httpService: HttpService) { }

    async favoriteMovie(userId: number, movieId: number) {
        // Verificar se o usuário existe
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        // Verificar se o filme já está favoritado pelo usuário
        const alreadyFavorited = await this.prisma.favorite.findUnique({
            where: { userId_movieId: { userId, movieId } },
        });
        if (alreadyFavorited) {
            throw new ConflictException('Filme já está nos favoritos.');
        }

        // Criar o registro de favorito
        await this.prisma.favorite.create({
            data: {
                userId,
                movieId,
            },
        });

        return true;
    }

    async toggleFavorite(userId: number, movieId: number): Promise<boolean> {
        console.log('Chegando no toggleFavorite com:', { userId, movieId });

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        const favorite = await this.prisma.favorite.findUnique({
            where: { userId_movieId: { userId, movieId } },
        });

        if (favorite) {
            console.log('Desfavoritando o filme:', { userId, movieId });
            await this.prisma.favorite.delete({
                where: { id: favorite.id },
            });
            return false;
        } else {
            console.log('Favoritando o filme:', { userId, movieId });
            await this.prisma.favorite.create({
                data: { userId, movieId },
            });
            return true;
        }
    }


    async isFavorite(userId: number, movieId: number): Promise<boolean> {
        const favorite = await this.prisma.favorite.findUnique({
            where: { userId_movieId: { userId, movieId } },
        });

        return !!favorite;
    }
}
