import { ConflictException, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MoviesService } from './movies.service';

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

  @Get('popular')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  async getPopularMovies(@Query('page') page: number = 1) {
    const movies = await this.moviesService.getPopularMovies(page);
    return movies;
  }
  

  @Get('top_rated')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  async getTopRatedMovies(@Query('page') page: number = 1) {
    const movies = await this.moviesService.getTopRatedMovies(page);
    return movies;
  }

  @Get('now_playing')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  async getNowPlayingMovies(@Query('page') page: number = 1) {
    const movies = await this.moviesService.getNowPlayingMovies(page);
    return movies;
  }

  @Get('upcoming')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  async getUpComingMovies(@Query('page') page: number = 1) {
    const movies = await this.moviesService.getUpComingMovies(page);
    return movies;
  }

  @Get('search')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  async getMoviesByString(@Query('search') search: string, @Query('page') page: number = 1) {
    const movies = await this.moviesService.getMoviesByString(search, page);
    return movies;
  }

  @Get(':movieId/details')
  @ApiParam({
    name: 'movieId',
    required: true,
    type: Number,
  })
  async getMovieDetails(@Param('movieId') movieId: number) {
    const movies = await this.moviesService.getMovieDetails(movieId);
    return movies;
  }

  @Get(':movieId/watch_providers')
  @ApiParam({
    name: 'movieId',
    required: true,
    type: Number,
  })
  async getMovieWatchProviders(@Param('movieId') movieId: number) {
    const movies = await this.moviesService.getMovieWatchProviders(movieId);
    return movies;
  }
}
