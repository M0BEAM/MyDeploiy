import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserServiceMS } from './user.ms';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private userServiceMs: UserServiceMS
  ) { }
  @Get()

  async getUsers() {
    return this.userService.getUsers();

  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  //Microservice methods
  // Create a project
  @Post(':userId/projects')
  async createProject(@Param('userId') userId: string, @Body() projectData: any) {
    return this.userService.createProject(userId, projectData.name, projectData.type);
  }

  // Deploy
  @Post(':userId/deploy')
  async deploy(
    @Param('userId') userId: string,
    @Body() deployData: any
  ) {
    if (deployData.projectId) {
      return this.userServiceMs.createDeploymentForProject(userId, deployData.projectId, deployData);
    } else {
      return this.userServiceMs.createDeployment(userId, deployData);
    }
  }

  @Put(":projectId/project/:deployId/deploy")

  async addDeployToProject(@Param("projectId") projectId: string, @Param("deployId") deployId: string) {
    this.userService.addDeployToProject(projectId, deployId)
  }

  @Get(":deployId/deployments")
  async getDeploys(@Param("deployId") deployId: string) {
    return this.userServiceMs.getDeployById(deployId)
  }

} 
