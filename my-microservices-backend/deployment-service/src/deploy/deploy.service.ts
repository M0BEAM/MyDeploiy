// src/deploy/deploy.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '../queue.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PrismaService } from 'prisma/prisma.service';

interface Auth {
  username: string;
  token: string;
}
@Injectable()
export class DeployService {
  constructor(
    private readonly queueService: QueueService,
    private readonly prisma: PrismaService
  ) { }
  private logger: Logger = new Logger(DeployService.name);

  async triggerDeployment(repoUrl: string, subdomain: string, type: string, method: string, auth: Auth, dockerImage: string, ciCd: string, category: string, startCommand: string, deployId: string) {
     // Fetch environment variables from DB
  const envVars = await this.prisma.environmentVariable.findMany({
    where: { deployId },
  });
    await this.queueService.addDeploymentJob({ repoUrl, subdomain, type, method, auth, dockerImage, ciCd, category, startCommand, envVars });
  }



  getDeployInfoUsingRepoUrl(repoUrl: string) {
    const data = {
      method: "self_host",
      subdomain: "normal",
      type: "static",
      auth:"11d5fbde41de6ba44abd4d310dd7be8bb630dae7"
    }
    return data
  }

  async updateDeployStatus(deployId: string, status: string) {
    await this.prisma.deploy.update({
      where: { id: deployId },
      data: { status },
    });
  }

}
