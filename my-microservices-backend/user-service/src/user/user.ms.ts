import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserServiceMS {

  constructor(
    private readonly prisma: PrismaService,
    @Inject('DEPLOYMENT_SERVICE') private deploymentClient: ClientProxy

  ) { }



  // ✅ Deploy directly (without a project)
  async createDeployment(userId: string, deployData: any) {
    // Validate user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Add security checks (e.g., ensure valid repo URL)
    if (!deployData.repoUrl) {
      throw new BadRequestException('Repository URL is required');
    }
    // Emit event to the deployment service
    try {

      const deploy = await this.prisma.deploy.create({
        data: {
          userId,
          projectId: deployData.projectId || null,
          subdomain: deployData.subdomain,
          repoUrl: deployData.gitUrl,
          method: deployData.method || 'gitUrl',
          type: deployData.type || 'WEB_SERVICE',
          status: 'PENDING',
        },
      });

     await this.deploymentClient.send('deploy', { userId, ...deployData, deployId: deploy.id }).toPromise();

      console.log('✅ Successfully sent message to deployment service');

      return { message: 'Deployment request sent', success: true, id: deploy.id };

    } catch (error) {
      return { message: error.message, success: false };
    }
  }

  // ✅ Deploy a project
  async createDeploymentForProject(userId: string, projectId: string, deployData: any) {
    // Check if the user owns the project
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) throw new NotFoundException('Project not found or not authorized');

    // Security checks
    if (!deployData.repoUrl) {
      throw new BadRequestException('Repository URL is required');
    }

    // Emit event to the deployment service
    this.deploymentClient.send('deploy', { userId, projectId, ...deployData }).toPromise();

    return { message: 'Deployment request sent for project', deploymentPayload: deployData };
  }


  async getDeployById(deployId: string) {
    return this.prisma.deploy.findUnique({ where: { id: deployId } });
  }
} 
