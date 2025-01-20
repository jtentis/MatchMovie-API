import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MoviesService } from './movies.service';

@Controller('movies')
@ApiTags('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

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

  @Get(':moviePoster/poster')
  @ApiParam({
    name: 'moviePoster',
    required: true,
    type: String,
  })
  async getMoviePoster(@Param('moviePoster') moviePoster: string) {
    const movies = await this.moviesService.getMoviePoster(moviePoster);
    return movies;
  }

  @Get('ingressoURL')
  async getIngressoUrl() {
    const movies = await this.moviesService.getIngressoUrl();
    return movies;
  }
}
