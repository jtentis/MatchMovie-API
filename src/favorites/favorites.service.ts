import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {

    private readonly TMDB_API_KEY = process.env.TMDB_API_KEY;
    private readonly TMDB_API_URL = 'https://api.themoviedb.org/3';

    constructor(private prisma: PrismaService, private readonly httpService: HttpService) { }

    async favoriteMovie(userId: number, movieId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        const alreadyFavorited = await this.prisma.favorite.findUnique({
            where: { userId_movieId: { userId, movieId } },
        });
        if (alreadyFavorited) {
            throw new ConflictException('Filme já está nos favoritos.');
        }

        await this.prisma.favorite.create({
            data: {
                userId,
                movieId,
            },
        });

        return true;
    }

    async toggleFavorite(userId: number, movieId: number): Promise<boolean> {
        // console.log('Chegando no toggleFavorite com:', { userId, movieId });

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        const favorite = await this.prisma.favorite.findUnique({
            where: { userId_movieId: { userId, movieId } },
        });

        if (favorite) {
            // console.log('Desfavoritando o filme:', { userId, movieId });
            await this.prisma.favorite.delete({
                where: { id: favorite.id },
            });
            return false;
        } else {
            // console.log('Favoritando o filme:', { userId, movieId });
            await this.prisma.favorite.create({
                data: { userId, movieId },
            });
            return true;
        }
    }

    async isFavorite(userId: number, movieId: number): Promise<boolean> {
        // console.log('Checking favorite for:', { userId, movieId });

        if (typeof userId !== 'number' || typeof movieId !== 'number') {
            throw new Error('Invalid userId or movieId. Must be integers.');
        }

        const favorite = await this.prisma.favorite.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });

        // console.log('Favorite found:', favorite);
        return !!favorite;
    }

    async getUserFavorites(userId: number): Promise<number> {
        return await this.prisma.favorite.count({
            where: { userId }
        });
    }

    async getFavoritedMovies(userId: number): Promise<any[]> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        // Get all watched movie IDs
        const watchedMovies = await this.prisma.favorite.findMany({
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
