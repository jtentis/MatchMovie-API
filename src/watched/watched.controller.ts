import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WatchedMovieDto } from './dto/watched-movie-dto';
import { WatchedService } from './watched.service';

@Controller('watched')
@ApiTags('watched')
export class WatchedController {

    constructor(private readonly watchedService: WatchedService) { }

    @Get(':userId/:movieId')
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
}
