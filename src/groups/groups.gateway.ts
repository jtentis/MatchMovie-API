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
          console.log(`Client ${client.id} joined room: ${room}`);
          client.join(room); // Join the exact room name sent by the client
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
}
