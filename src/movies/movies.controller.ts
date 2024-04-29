import { Controller, Post, Get, Param, NotFoundException, ConflictException } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
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
  
}