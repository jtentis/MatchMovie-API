import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class MoviesService {

  private readonly TMDB_API_KEY = '2017240ed8d4e61fbe9ed801fe5da25a';
  private readonly TMDB_API_URL = 'https://api.themoviedb.org/3';

  constructor(private prisma: PrismaService, private readonly httpService: HttpService ) { }

  async favoriteMovie(userId: number, movieId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return this.prisma.movie.update({
      where: { id: movieId },
      data: {
        favoritedBy: {
          connect: { id: userId },
        },
      },
    });
  }

  async markAsWatched(userId: number, movieId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return this.prisma.movie.update({
      where: { id: movieId },
      data: {
        watchedBy: {
          connect: { id: userId },
        },
      },
    });
  }

  async getUserMovies(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        favoriteMovies: true,
        watchedMovies: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      favoriteMovies: user.favoriteMovies,
      watchedMovies: user.watchedMovies,
    };
  }
  // const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';

  async getPopularMovies(page?: number): Promise<any> {
    const response$ = this.httpService.get(
      `${this.TMDB_API_URL}/movie/popular?language=pt-BR&page=${page}`,
      {
        params: {
          api_key: this.TMDB_API_KEY,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getTopRatedMovies(page?: number): Promise<any> {
    const response$ = this.httpService.get(
        `${this.TMDB_API_URL}/movie/top_rated?language=pt-BR&page=${page}`,
        {
          params: {
            api_key: this.TMDB_API_KEY,
          },
        },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getNowPlayingMovies(page?: number): Promise<any> {
    const response$ = this.httpService.get(
        `${this.TMDB_API_URL}/movie/now_playing?language=pt-BR&page=${page}`,
        {
          params: {
            api_key: this.TMDB_API_KEY,
          },
        },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getUpComingMovies(page?: number): Promise<any> {
    const response$ = this.httpService.get(
        `${this.TMDB_API_URL}/movie/upcoming?language=pt-BR&page=${page}`,
        {
          params: {
            api_key: this.TMDB_API_KEY,
          },
        },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getMoviesByString(query: string): Promise<any> {
    const response$ = this.httpService.get(

      `${this.TMDB_API_URL}/search/movie?query=${query}&language=pt-br`,
      {
        params: {
          api_key: this.TMDB_API_KEY,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }
}