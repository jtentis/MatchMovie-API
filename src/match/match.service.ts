import { Injectable, NotFoundException } from '@nestjs/common';
import fetch from 'node-fetch';
import { GroupsGateway } from '../groups/groups.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchService {
    constructor(
        private prisma: PrismaService,
        private groupsGateway: GroupsGateway,

    ) { }

    private readonly TMDB_API_KEY = process.env.TMDB_API_KEY;
    private readonly TMDB_API_URL = 'https://api.themoviedb.org/3';

    async fetchMovieDetails(movieId: number): Promise<any> {
        try {
            const response = await fetch(
                `${this.TMDB_API_URL}/movie/${movieId}?api_key=${this.TMDB_API_KEY}&language=pt-BR`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }

            return await response.json();
        } catch (error) {
            throw new NotFoundException('Movie details could not be fetched');
        }
    }

    async startMatch(groupId: number, movieId: number) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            include: { users: true },
        });

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        this.groupsGateway.startMatch(groupId, movieId);

        return { message: `Match started for group ${groupId} with movie ${movieId}.` };
    }

    async vote(groupId: number, userId: number, movieId: number, liked: boolean) {
        await this.prisma.vote.upsert({
            where: { 
                userId_groupId_movieId: { userId, groupId, movieId } // Prisma will NOT recognize this by default
            }, 
            update: { liked },
            create: { userId, groupId, movieId, liked },
        });

        const votes = await this.prisma.vote.findMany({ where: { groupId } });

        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            include: { users: true },
        });

        const groupUserIds = group.users.map((user) => user.userId);

        // ver se todos usuarios dera like no mesmo filme
        const likedMovies = votes
            .filter((vote) => vote.liked)
            .reduce((acc, vote) => {
                acc[vote.movieId] = (acc[vote.movieId] || 0) + 1;
                return acc;
            }, {} as Record<number, number>);

        const consensusMovieId = Object.keys(likedMovies).find(
            (movieId) => likedMovies[Number(movieId)] === groupUserIds.length
        );

        if (consensusMovieId) {
            // emitir ganhador para todos o grupo
            const winnerMovie = await this.fetchMovieDetails(Number(consensusMovieId));
            this.groupsGateway.notifyWinner(groupId, winnerMovie);
            await this.checkForMatch(groupId);                         // TODO: consertar para quando o usuário parar o match no meio
            await this.prisma.vote.deleteMany({ where: { groupId } }); // deletando tabela quando o match é finalizado para impedir de dar match logo quando iniciar outro.
            return { winner: winnerMovie };
        }
        return { winner: null };
    }



    async getRecommendations(groupId: number) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });

        if (!group || !group.movieId) {
            throw new NotFoundException('Group or base movie not found');
        }

        const response = await fetch(
            `${this.TMDB_API_URL}/movie/${group.movieId}/recommendations?language=pt-BR&api_key=${this.TMDB_API_KEY}`
        );


        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        if (!data.results || !Array.isArray(data.results)) {
            throw new Error('Invalid recommendations data from TMDB');
        }

        this.groupsGateway.sendRecommendations(groupId, data.results);
        // console.log(data.results)
        return data.results;
    }

    async checkForMatch(groupId: number): Promise<void> {
        const groupMembersCount = await this.prisma.userGroup.count({
            where: { groupId },
        });

        const votes = await this.prisma.vote.groupBy({
            by: ['movieId'],
            where: {
                groupId,
                liked: true,
            },
            _count: {
                movieId: true,
            },
        });

        const winningVote = votes.find(vote => vote._count.movieId === groupMembersCount);

        if (winningVote) {
            const movieDetails = await this.fetchMovieDetails(winningVote.movieId); // Fetch movie details
    
            // Create a new match even if the same movie was matched before
            await this.prisma.match.create({
                data: {
                    groupId,
                    movieId: winningVote.movieId,
                    winnerTitle: movieDetails.title,
                },
            });
        }
    }

    async getMatchHistory(groupId: number): Promise<any> {
        const matches = await this.prisma.match.findMany({
            where: { groupId },
            orderBy: { createdAt: 'desc' },
        });

        return matches;
    }

    async deleteMatch(id: number): Promise<boolean> {
        const match = await this.prisma.match.findUnique({ where: { id } });
        if (!match) return false;

        await this.prisma.match.delete({ where: { id } });
        return true;
    }
}
