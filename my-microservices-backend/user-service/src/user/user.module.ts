import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserServiceMS } from './user.ms';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroservicesModule } from './microservices.module';

@Module({
  imports: [PrismaModule,
    MicroservicesModule
  ],
  
  controllers: [UserController],
  providers: [UserService,UserServiceMS], // Make sure UserService is listed here
  exports: [UserService],   // Export UserService if used in other modules
})
export class UserModule {}
