// src/deployment/deployment.module.ts
import { Module } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
   
  ],
  providers: [DeployService,PrismaService],
  exports: [DeployService],
})
export class DeployModule {}