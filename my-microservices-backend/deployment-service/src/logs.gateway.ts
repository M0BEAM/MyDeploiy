import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: "*", // Adjust for production
  },
})
export class LogsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  // Store an array of clients per subdomain
  private subdomainClients = new Map<string, Socket[]>();

  handleConnection(client: Socket) {
    const subdomain = client.handshake.query.subdomain as string;
    // console.log(`Client connected with subdomain: ${subdomain}`);
    if (subdomain) {
      // Get existing clients for the subdomain or start with an empty array
      const clients = this.subdomainClients.get(subdomain) || [];
      clients.push(client);
      this.subdomainClients.set(subdomain, clients);
    }
  }

  handleDisconnect(client: Socket) {
    // Find and remove the disconnected client from all subdomain arrays
    this.subdomainClients.forEach((clients, subdomain) => {
      const index = clients.findIndex(sock => sock.id === client.id);
      if (index !== -1) {
        clients.splice(index, 1);
        // console.log(`Client disconnected for subdomain: ${subdomain}`);
        // If no clients remain, remove the key
        if (clients.length === 0) {
          this.subdomainClients.delete(subdomain);
        } else {
          this.subdomainClients.set(subdomain, clients);
        }
      }
    });
  }

  async sendLogMessage(subdomain: string,deployId:string, message: string) {
    const clients = this.subdomainClients.get(subdomain);
   
    if (clients && clients.length > 0) {
      clients.forEach(client => {
        client.emit('log_update', message);
      });
    } else {
      console.log(`No clients connected for subdomain: ${subdomain}`);
    }

  }

}
