import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WatchedService {

    private readonly TMDB_API_KEY = process.env.TMDB_API_KEY;
    private readonly TMDB_API_URL = 'https://api.themoviedb.org/3';

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
        // console.log('Chegando no toggleWatched com:', { userId, movieId });

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        const watched = await this.prisma.watched.findUnique({
            where: { userId_movieId: { userId, movieId } },
        });

        if (watched) {
            // console.log('Desfavoritando o filme:', { userId, movieId });
            await this.prisma.watched.delete({
                where: { id: watched.id },
            });
            return false;
        } else {
            // console.log('Favoritando o filme:', { userId, movieId });
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

    async getUserWatched(userId: number): Promise<number> {
        return await this.prisma.watched.count({
            where: { userId }
        });
    }

    async getWatchedMovies(userId: number): Promise<any[]> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        // Get all watched movie IDs
        const watchedMovies = await this.prisma.watched.findMany({
            where: { userId },
            select: { movieId: true },
        });

        // Fetch full movie details from TMDB API
        const movieDetails = await Promise.all(
            watchedMovies.map(async (movie) => {
                try {
                    const response = await lastValueFrom(
                        this.httpService.get(`${this.TMDB_API_URL}/movie/${movie.movieId}`, {
                            params: { api_key: this.TMDB_API_KEY, language: 'pt-BR' },
                        })
                    );
                    return {
                        id: response.data.id,
                        poster_path: response.data.poster_path,
                    };
                } catch (error) {
                    console.error(`Error fetching movie ${movie.movieId}:`, error.message);
                    return null;
                }
            })
        );

        return movieDetails.filter((movie) => movie !== null); // Remove any failed fetches
    }
    
}
