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

        // Emit match start event to all group members
        this.groupsGateway.startMatch(groupId, movieId);

        return { message: `Match started for group ${groupId} with movie ${movieId}.` };
    }

    async vote(groupId: number, userId: number, movieId: number, liked: boolean) {
        // Save vote using the composite key
        await this.prisma.vote.upsert({
            where: { userId_groupId: { userId, groupId } }, // Use composite key
            update: { movieId, liked }, // Update if the vote already exists
            create: { userId, groupId, movieId, liked }, // Create new vote if it doesn't exist
        });

        // Fetch all votes for the group
        const votes = await this.prisma.vote.findMany({ where: { groupId } });

        // Fetch group users
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            include: { users: true },
        });

        const groupUserIds = group.users.map((user) => user.userId);

        // Determine if all users have liked the same movie
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
            // Emit the winner to all clients
            const winnerMovie = await this.fetchMovieDetails(Number(consensusMovieId));
            this.groupsGateway.notifyWinner(groupId, winnerMovie);
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

        // Fetch movie recommendations from The Movie Database API
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

        // Send recommendations to all group members
        this.groupsGateway.sendRecommendations(groupId, data.results);
        // console.log(data.results)
        return data.results;
    }
}
