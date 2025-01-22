import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
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

  @Get('ingressoURL/city/:cityId')
  @ApiOperation({ summary: 'Pegar a url do cinema mais proximo para redirecionamento.'})
  @ApiParam({
    name: 'cityId',
    required: true,
    type: Number,
  })
  async getIngressoUrl(@Param('cityId') cityId: number) {
    const movies = await this.moviesService.getIngressoUrl(Number(cityId));
    return movies;
  }

  @Get('ingressoURL/lat/:lat/lng/:lng')
  @ApiOperation({ summary: 'Listar o cinema mais proximo baseado na latitude e longitude média dos usuários do grupo'})
  @ApiParam({
    name: 'lat',
    required: true,
    type: Number,
  })
  @ApiParam({
    name: 'lng',
    required: true,
    type: Number,
  })
  async getIngressoLatLng(@Param('lat') lat: number, @Param('lng') lng: number) {
    const movies = await this.moviesService.getIngressoLatLng(Number(lat), Number(lng));
    return movies;
  }
}
