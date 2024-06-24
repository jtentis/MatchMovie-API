import { Controller, Post, Get, Param, NotFoundException, ConflictException, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import {ApiQuery, ApiTags} from "@nestjs/swagger";

@Controller('movies')
@ApiTags('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post(':movieId/favorite/:userId')
  async favoriteMovie(
    @Param('movieId') movieId: string,
    @Param('userId') userId: string,
  ) {
    try {
      await this.moviesService.favoriteMovie(parseInt(userId), parseInt(movieId));
      return { message: 'Filme favoritado com sucesso!' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new Error('Erro ao favoritar filme');
      }
    }
  }

  @Post(':movieId/watched/:userId')
  async markAsWatched(
    @Param('movieId') movieId: string,
    @Param('userId') userId: string,
  ) {
    try {
      await this.moviesService.markAsWatched(parseInt(userId), parseInt(movieId));
      return { message: 'Filme marcado como assistido com sucesso!' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new Error('Erro ao marcar filme como assistido');
      }
    }
  }

  @Get('user/:userId')
  async getUserMovies(
    @Param('userId') userId: string,
  ) {
    const userMovies = await this.moviesService.getUserMovies(parseInt(userId));
    if (!userMovies) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return userMovies;
  }

  @Get('popular')
  @ApiQuery({
    required: false
  })
  async getPopularMovies(@Query('page') page: number = 1) {
    const movies = await this.moviesService.getPopularMovies(page);
    return movies;
  }

  @Get('top_rated')
  @ApiQuery({
    required: false
  })
  async getTopRatedMovies(@Query('page') page: number = 1) {
    const movies = await this.moviesService.getTopRatedMovies(page);
    return movies;
  }

  @Get('now_playing')
  @ApiQuery({
    required: false
  })
  async getNowPlayingMovies(@Query('page') page: number = 1) {
    const movies = await this.moviesService.getNowPlayingMovies(page);
    return movies;
  }

  @Get('upcoming')
  @ApiQuery({
    required: false
  })
  async getUpComingMovies(@Query('page') page: number = 1) {
    const movies = await this.moviesService.getUpComingMovies(page);
    return movies;
  }

  @Get('search')
  async getMoviesBy(@Query('search') search: string) {
    const movies = await this.moviesService.getMoviesByString(search);
    return movies;
  }
  
}
