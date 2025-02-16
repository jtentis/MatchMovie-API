import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MatchService } from './match.service';

@ApiTags('match')
@Controller('match')
export class MatchController {
  constructor(private matchService: MatchService) { }

  @ApiOperation({ summary: 'Começar match de grupo'})
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':groupId/start/:movieId')
  async startMatch(
    @Param('groupId') groupId: number,
    @Param('movieId') movieId: number,
  ) {
    return this.matchService.startMatch(groupId, movieId);
  }

  @ApiOperation({ summary: 'Receber votos de grupo'})
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':groupId/vote')
  async voteMovie(
    @Param('groupId') groupId: number,
    @Body('userId') userId: number,
    @Body('movieId') movieId: number,
    @Body('liked') liked: boolean,
  ) {
    return this.matchService.vote(Number(groupId), Number(userId), Number(movieId), Boolean(liked));
  }

  @ApiOperation({ summary: 'Listar filmes recomendados baseado em filme do grupo'})
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':groupId/recommendations')
  async getRecommendations(@Param('groupId') groupId: number) {
    return this.matchService.getRecommendations(Number(groupId));
  }

  @ApiOperation({ summary: 'Checar match do grupo'})
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':groupId/check')
  async checkForMatch(@Param('groupId') groupId: number) {
    return this.matchService.checkForMatch(Number(groupId));
  }

  @ApiOperation({ summary: 'Checar historico de match do grupo'})
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':groupId/history')
  async getMatchHistory(@Param('groupId') groupId: number) {
    return this.matchService.getMatchHistory(Number(groupId));
  }

  @ApiOperation({ summary: 'Deletar match do grupo'})
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async deleteMatch(@Param('id') id: number) {
    const deleted = await this.matchService.deleteMatch(Number(id));
    if (!deleted) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Match deleted successfully' };
  }
}
