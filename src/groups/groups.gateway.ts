import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins for simplicity; restrict for production
    },
})
export class GroupsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);

        client.on('joinRoom', (room: string) => {
            console.log(`Received joinRoom for room: ${room}`);
            if (!room.startsWith('user_')) {
                console.error(`Invalid room name: ${room}`);
                client.emit('error', { message: 'Invalid room name.' });
                return;
            }

            console.log(`Client ${client.id} joined room: ${room}`);
            client.join(room); // Join the exact room name sent by the client
        });

        client.on('joinGroupRoom', (groupId: number) => {
            const room = `group_${groupId}`;
            console.log(`Client ${client.id} joined group room: ${room}`);
            client.join(room);
        });
    }


    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // Method to notify the user of group addition
    notifyUserAddedToGroup(userId: number, groupId: number) {
        this.server.to(`user_${userId}`).emit('groupUpdated', {
            groupId,
            message: `You have been added to group ${groupId}.`,
        });
    }

    notifyGroupTest(userId: number) {
        this.server.to(`user_${userId}`).emit('groupUpdated', {
            groupId: 123,
            message: 'Test group update',
        });
    }

    notifyGroupUpdated(userId: number) {
        console.log('Emitting groupUpdated event for user', userId);
        this.server.to(`user_${userId}`).emit('groupUpdated', {
            message: `The group has been updated.`,
        });
    }

    notifyGroupCreated(group: any, userIds: number[]) {
        userIds.forEach((userId) => {
            this.server.to(`user_${userId}`).emit('groupCreated', group);
        });
    }

    startMatch(groupId: number, movieId: number) {
        this.server.to(`group_${groupId}`).emit('matchStarted', { groupId, movieId });
    }

    sendRecommendations(groupId: number, recommendations: any) {
        this.server.to(`group_${groupId}`).emit('movieRecommendations', recommendations);
    }

    notifyWinner(groupId: number, winnerMovie: any): void {
        console.log(`Broadcasting winner for group ${groupId}`);
        this.server.to(`group_${groupId}`).emit('gameWinner', {
            movieId: winnerMovie.movieId,
            message: `The winning movie is ${winnerMovie.title}!`,
        });
    }

    sendVoteUpdate(groupId: number, votes: any) {
        this.server.to(`group_${groupId}`).emit('voteUpdate', votes);
    }

    joinGroupRoom(client: Socket, groupId: number) {
        const room = `group_${groupId}`;
        console.log(`Client ${client.id} joined room: ${room}`);
        client.join(room);
    }

    leaveGroupRoom(client: Socket, groupId: number) {
        const room = `group_${groupId}`;
        console.log(`Client ${client.id} left room: ${room}`);
        client.leave(room);
    }

    notifyGroupRoom(groupId: number, event: string, data: any) {
        const room = `group_${groupId}`;
        console.log(`Notifying room: ${room} with event: ${event}`);
        this.server.to(room).emit(event, data);
    }
}
