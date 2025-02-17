import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MoviesService } from './movies.service';

@Controller('movies')
@ApiTags('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get('popular')
  @ApiOperation({ summary: 'Listar filmes populares'})
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
  @ApiOperation({ summary: 'Listar filmes melhor avaliados'})
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
  @ApiOperation({ summary: 'Listar filmes em cartaz'})
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
  @ApiOperation({ summary: 'Listar filmes em breve'})
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
  @ApiOperation({ summary: 'Listar filmes por nome'})
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
  @ApiOperation({ summary: 'Listar detalhes do filme'})
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
  @ApiOperation({ summary: 'Listar streaming disponiveis do filme'})
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
  @ApiOperation({ summary: 'Listar poster do filme'})
  @ApiParam({
    name: 'moviePoster',
    required: true,
    type: String,
  })
  async getMoviePoster(@Param('moviePoster') moviePoster: string) {
    const movies = await this.moviesService.getMoviePoster(moviePoster);
    return movies;
  }
}
