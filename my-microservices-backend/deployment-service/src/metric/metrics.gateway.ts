// import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { Injectable, Logger } from '@nestjs/common';
// import { MetricService } from './metric.service';

// @WebSocketGateway({
//   cors: { origin: '*' },
// })
// @Injectable()
// export class MetricGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   private logger = new Logger('MetricGateway');
//   @WebSocketServer() server: Server;
//   private clients = new Map<string, Socket>();

//   constructor(private readonly metricService: MetricService) {}

//   handleConnection(client: Socket) {
//     const subdomain = client.handshake.query.subdomain as string;
//     if (subdomain) {
//       this.clients.set(subdomain, client);
//       this.logger.log(`Client connected for subdomain: ${subdomain}`);
//       this.startMetricsUpdates(subdomain);
//     }
//   } 
 
//   handleDisconnect(client: Socket) {
//     const subdomain = [...this.clients.entries()].find(([_, socket]) => socket.id === client.id)?.[0];
//     if (subdomain) {
//       this.clients.delete(subdomain);
//       this.logger.log(`Client disconnected for subdomain: ${subdomain}`);
//     }
//   }

//   async startMetricsUpdates(subdomain: string) {
//     setInterval(async () => {
//       const metrics = await this.metricService.getContainerMetrics(subdomain);
//       const client = this.clients.get(subdomain);
//       if (client) {
//         client.emit('metrics_update', metrics);
//       }
//     }, 3000); // Update every 3 seconds
//   }
// }
