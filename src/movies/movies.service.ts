import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MoviesService {

  private readonly TMDB_API_KEY = process.env.TMDB_API_KEY;
  private readonly TMDB_API_URL = 'https://api.themoviedb.org/3';
  private readonly TMDB_API_POSTER_URL = 'https://image.tmdb.org/t/p/w500';

  constructor(private prisma: PrismaService, private readonly httpService: HttpService) { }

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

  async getPopularMovies(page: number = 1): Promise<any> {
    const response$ = this.httpService.get(
      `${this.TMDB_API_URL}/movie/popular?language=pt-BR&region=BR&page=${page}`,
      {
        params: {
          api_key: this.TMDB_API_KEY,
          page,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getTopRatedMovies(page: number = 1): Promise<any> {
    const response$ = this.httpService.get(
      `${this.TMDB_API_URL}/movie/top_rated?language=pt-BR&region=BR&page=${page}`,
      {
        params: {
          api_key: this.TMDB_API_KEY,
          page,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getNowPlayingMovies(page: number = 1): Promise<any> {
    const response$ = this.httpService.get(
      `${this.TMDB_API_URL}/movie/now_playing?language=pt-BR&region=BR&page=${page}`,
      {
        params: {
          api_key: this.TMDB_API_KEY,
          page,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getUpComingMovies(page: number = 1): Promise<any> {
    const response$ = this.httpService.get(
      `${this.TMDB_API_URL}/movie/upcoming?language=pt-BR&region=BR&page=${page}`,
      {
        params: {
          api_key: this.TMDB_API_KEY,
          page,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getMoviesByString(query: string, page: number = 1): Promise<any> {
    const response$ = this.httpService.get(

      `${this.TMDB_API_URL}/search/movie?query=${query}&language=pt-BR&region=BR&page=${page}`,
      {
        params: {
          api_key: this.TMDB_API_KEY,
          page,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getMovieDetails(movie_id: number): Promise<any> {
    const response$ = this.httpService.get(
      `${this.TMDB_API_URL}/movie/${movie_id}?append_to_response=credits&language=pt-BR`,
      {
        params: {
          api_key: this.TMDB_API_KEY,
          movie_id,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getMovieWatchProviders(movie_id: number): Promise<any> {
    const response$ = this.httpService.get(
      `${this.TMDB_API_URL}/movie/${movie_id}/watch/providers`,
      {
        params: {
          api_key: this.TMDB_API_KEY,
          movie_id,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getMoviePoster(poster_path: string): Promise<any> {
    const response$ = this.httpService.get(
      `${this.TMDB_API_POSTER_URL}${poster_path}`,
      {
        headers:{
          'Content-type' : 'image/jpeg',
          
        },
        responseType: 'arraybuffer'
      }
    );
    const response = await lastValueFrom(response$);
    const byteArray = new Uint8Array(response.data);

    const base64Image = Buffer.from(byteArray).toString('base64');
    const src = `${base64Image}`;
    return src;
  }
}