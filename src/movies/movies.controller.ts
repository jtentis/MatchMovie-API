import { Body, Controller, Get, InternalServerErrorException, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger";
import { IsInt } from 'class-validator';
import { FavoriteMovieDto } from './dto/favorite-movie.dto';
import { MoviesService } from './movies.service';

class ToggleFavoriteDto {
  @IsInt()
  userId: number;

  @IsInt()
  movieId: number;
}

@Controller('movies')
@ApiTags('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get('favorites/:userId/:movieId')
  async isFavorite(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ) {
  
    try {
      const isFavorited = await this.moviesService.isFavorite(Number(userId), Number(movieId));
      return { isFavorited };
    } catch (error) {
      console.error('Error in isFavorite:', error);
      throw new InternalServerErrorException('Error checking favorite status.');
    }
  }

  @ApiProperty()
  @Post('favorites')
  async toggleFavorite(@Body() { userId, movieId }: FavoriteMovieDto) {
  
    try {
      const isFavorited = await this.moviesService.toggleFavorite(Number(userId), Number(movieId));
      return {
        message: isFavorited
          ? 'Movie favorited successfully!'
          : 'Movie unfavorited successfully!',
      };
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      throw new InternalServerErrorException('Error toggling favorite status.');
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
}
