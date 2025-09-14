// src/deploy/deploy.controller.ts
import { Controller, Post, Body, Logger, Get, Param, Res } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { exec } from 'child_process';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from 'prisma/prisma.service';

@Controller('deploy')
export class DeployController {
  private logger = new Logger(DeployController.name);
  eventEmitter: any;
  constructor(
    private readonly deployService: DeployService,
        private readonly prisma: PrismaService,
  ) { }

  // @Post()
  // async deploy(@Body() body: any) {
  //   const { repoUrl, subdomain, type, method, auth, dockerImage, ciCd, category, startCommand, sshUrl } = body;
  //   if (!subdomain || !repoUrl) {
  //     console.log("missed !!")
  //     return;
  //   }

  //   this.logger.log(`Manual deployment triggered for ${repoUrl}`);
  //   await this.deployService.triggerDeployment(repoUrl, subdomain, type, method, auth, dockerImage, ciCd, category, startCommand, sshUrl);

  //   return { message: 'Deployment job added manually' };
  // }



  @MessagePattern('deploy')
  async deployy(@Payload() deployData: any) {
    this.logger.log(`✅ Received deployment: `, deployData);
    console.log("deployId: ",deployData.deployId)
    try {
      // Validate project exists
      if (deployData.projectId) {
        const project = await this.prisma.project.findUnique({
          where: { id: deployData.projectId },
        });
  
        if (!project) {
          throw new Error(`Invalid Project ID: ${deployData.projectId}`);
        }
      }
  let existingDeployment:any;
     try {
       // Get existing deployment record
        existingDeployment = await this.prisma.deploy.findUnique({
        where: { id: deployData.deployId },
      });
  
      if (!existingDeployment) {
        throw new Error(`Deployment ${deployData.deployId} not found`);
      }
  
      // Update deployment status to IN_PROGRESS
      await this.prisma.deploy.update({
        where: { id: deployData.deployId },
        data: { status: 'PENDING' }
      });
     } catch (error) {
      console.log(error.message)
     }
     try {
      // Execute deployment and wait for completion
     await this.deployService.triggerDeployment(
        deployData.repoUrl, 
        deployData.subdomain,
        deployData.type,
        deployData.method,
        deployData.auth,
        deployData.dockerImage,
        deployData.ciCd,
        deployData.category,
        deployData.startCommand,
        deployData.sshUrl
      );
  
      // Handle successful completion
     
        await this.prisma.deploy.update({
          where: { id: deployData.deployId },
          data: { 
            status: 'SUCCESS',
            endedAt: new Date(),
            duration: new Date().getTime() - existingDeployment.startedAt.getTime()
          }
        });
     
      } catch (error) {
        console.log(error.message)
      }
      
  
      // this.eventEmitter.emit('deployment.complete', {
      //   deployId: deployData.deployId,
      //   status: 'SUCCESS'
      // });
  
      return { 
        message: 'Deployment completed successfully',
        deployId: deployData.deployId
      };
  
    } catch (error) {
      // Handle failure
      await this.prisma.deploy.update({
        where: { id: deployData.deployId },
        data: { 
          status: 'FAILED',
          endedAt: new Date(),
          errorMessage: error.message
        }
      });
  
      // this.eventEmitter.emit('deployment.failed', {
      //   deployId: deployData.deployId,
      //   error: error.message
      // });
  
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }
}
