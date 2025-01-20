import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MatchService } from './match.service';

@ApiTags('match')
@Controller('match')
export class MatchController {
  constructor(private matchService: MatchService) { }

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

  @Post(':groupId/check')
  async checkForMatch(@Param('groupId') groupId: number) {
    return this.matchService.checkForMatch(Number(groupId));
  }

  @Get(':groupId/history')
  async getMatchHistory(@Param('groupId') groupId: number) {
    return this.matchService.getMatchHistory(Number(groupId));
  }

  @Delete(':id')
  async deleteMatch(@Param('id') id: number) {
    const deleted = await this.matchService.deleteMatch(Number(id));
    if (!deleted) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Match deleted successfully' };
  }
}
