import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WatchedMovieDto } from './dto/watched-movie-dto';
import { WatchedService } from './watched.service';

@Controller('watched')
@ApiTags('watched')
export class WatchedController {

    constructor(private readonly watchedService: WatchedService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Verificar se filme já foi marcado como assistido ou não' })
    @Get('isWatched/:userId/:movieId')
    async isWatched(
        @Param('userId') userId: string,
        @Param('movieId') movieId: string,
    ) {

        try {
            const isWatched = await this.watchedService.isWatched(Number(userId), Number(movieId));
            return { isWatched };
        } catch (error) {
            console.error('Error in isFavorite:', error);
            throw new InternalServerErrorException('Error checking favorite status.');
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Marcar filme como assistido' })
    @Post()
    async toggleWatched(@Body() { userId, movieId }: WatchedMovieDto) {

        try {
            const isWatched = await this.watchedService.toggleWatched(Number(userId), Number(movieId));
            return {
                message: isWatched
                    ? 'Movie marked as watched successfully!'
                    : 'Movie unmarked as watched successfully!',
            };
        } catch (error) {
            console.error('Error in toggleWatched:', error);
            throw new InternalServerErrorException('Error toggling watched status.');
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Contar quantidade de assistidos do usuário' })
    @Get('count/:userId')
    async getFavoriteCount(@Param('userId') userId: number) {
        const count = await this.watchedService.getUserWatched(Number(userId));
        if (count === null) {
            throw new NotFoundException('User not found or has no favorites.');
        }
        return { count };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar filmes marcados como assistido' })
    @Get(':userId')
    async getUserWatchedMovies(@Param('userId') userId: number) {
        return this.watchedService.getWatchedMovies(Number(userId));
    }
}
