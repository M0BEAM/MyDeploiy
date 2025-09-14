import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DEPLOYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'my-microservices-backend-deployment-service-1', //change this to deployment-service container name
          port: 3009,
        },
      },
    ]),
  ],
  exports: [ClientsModule]
})
export class MicroservicesModule {}