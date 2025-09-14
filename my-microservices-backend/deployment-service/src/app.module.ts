// src/app.module.ts
import { Module } from '@nestjs/common';
import { WebhookController } from './webhook/webhook.controller';
import { DeployController } from './deploy/deploy.controller';
import { DeployService } from './deploy/deploy.service';
import { QueueService } from './queue.service';
import { LocalHostingService } from './local-hosting.service';
import { GithubAuthModule } from './github-auth/github-auth.module';
import { GithubModule } from './github/github.module';
import { WebhookModule } from './webhook/webhook.module';
import { LogsGateway } from './logs.gateway';
import { MetricModule } from './metric/metric.module';
import { MetricService } from './metric/metric.service';
import { LogModule } from './log/log.module';
import { PrismaModule } from './prisma/prisma.module';
import { EnvModule } from './env/env.module';

@Module({
  controllers: [WebhookController, DeployController],
  providers: [QueueService, DeployService, LocalHostingService,LogsGateway,MetricService],
  imports: [GithubAuthModule, GithubModule,WebhookModule, MetricModule, LogModule,PrismaModule, EnvModule],
})
export class AppModule {}
