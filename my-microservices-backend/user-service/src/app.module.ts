import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { MicroservicesModule } from './user/microservices.module';

@Module({

  providers: [AppService, UserService,PrismaService],
  imports: [
    UserModule,
    AuthModule,
    ProjectModule,
    MicroservicesModule
  ],
})
export class AppModule {}
