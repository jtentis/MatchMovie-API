import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FavoriteMovieDto } from './dto/favorite-movie.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@ApiTags('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}
    @Get(':userId/:movieId')
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
}
