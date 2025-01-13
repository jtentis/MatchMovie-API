import { BadRequestException, Body, ConflictException, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { IsInt } from 'class-validator';
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

  @Post(':movieId/favorite/:userId')
  async favoriteMovie(
    @Param('movieId') movieId: string,
    @Param('userId') userId: string,
  ) {
    try {
      await this.moviesService.favoriteMovie(parseInt(userId), parseInt(movieId));
      return { message: 'Filme favoritado com sucesso!' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Erro interno ao favoritar filme.');
    }
  }

  @Get('favorites/:userId/:movieId')
  async isFavorite(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ) {
    const numericUserId = parseInt(userId, 10);
    const numericMovieId = parseInt(movieId, 10);
  
    if (isNaN(numericUserId) || isNaN(numericMovieId)) {
      throw new BadRequestException('userId and movieId must be valid numbers.');
    }
  
    try {
      const isFavorited = await this.moviesService.isFavorite(numericUserId, numericMovieId);
      return { isFavorited };
    } catch (error) {
      console.error('Error in isFavorite:', error);
      throw new InternalServerErrorException('Error checking favorite status.');
    }
  }

  @Post('favorites')
  async toggleFavorite(
    @Body() { userId, movieId }: { userId: string | number; movieId: string | number },
  ) {
    const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const numericMovieId = typeof movieId === 'string' ? parseInt(movieId, 10) : movieId;
  
    if (isNaN(numericUserId) || isNaN(numericMovieId)) {
      throw new BadRequestException('userId and movieId must be valid numbers.');
    }
  
    try {
      const isFavorited = await this.moviesService.toggleFavorite(numericUserId, numericMovieId);
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
