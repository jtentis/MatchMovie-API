import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

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
}
