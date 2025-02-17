import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FavoriteMovieDto } from './dto/favorite-movie.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@ApiTags('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @Get('isFavorite/:userId/:movieId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Verificar se filme já foi marcado como favorito ou não'})
    @ApiBearerAuth()
    async isFavorite(
        @Param('userId') userId: string,
        @Param('movieId') movieId: string,
    ) {

        try {
            const isFavorited = await this.favoritesService.isFavorite(Number(userId), Number(movieId));
            return { isFavorited };
        } catch (error) {
            console.error('Error in isFavorite:', error);
            throw new InternalServerErrorException('Error checking favorite status.');
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Marcar filme como favorito'})
    @Post()
    async toggleFavorite(@Body() { userId, movieId }: FavoriteMovieDto) {

        try {
            const isFavorited = await this.favoritesService.toggleFavorite(Number(userId), Number(movieId));
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

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Contar quantidade de favoritos do usuário'})
    @Get('count/:userId')
    async getFavoriteCount(@Param('userId') userId: number) {
        const count = await this.favoritesService.getUserFavorites(Number(userId));
        if (count === null) {
            throw new NotFoundException('User not found or has no favorites.');
        }
        return { count };
    }
}
