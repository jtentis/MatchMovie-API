import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MatchService } from './match.service';

@ApiTags('match')
@Controller('match')
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Post(':groupId/start/:movieId')
  async startMatch(
    @Param('groupId') groupId: number,
    @Param('movieId') movieId: number,
  ) {
    return this.matchService.startMatch(groupId, movieId);
  }

  @Post(':groupId/vote')
  async voteMovie(
    @Param('groupId') groupId: number,
    @Body('userId') userId: number,
    @Body('movieId') movieId: number,
    @Body('liked') liked: boolean,
  ) {
    return this.matchService.vote(Number(groupId), Number(userId), Number(movieId), Boolean(liked));
  }

  @Get(':groupId/recommendations')
  async getRecommendations(@Param('groupId') groupId: number) {
    return this.matchService.getRecommendations(Number(groupId));
  }
}
