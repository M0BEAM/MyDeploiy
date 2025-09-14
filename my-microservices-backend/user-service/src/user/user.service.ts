import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async createUser(name: string, email: string, password: string, role: string = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
  }
  async findUserByEmail(email: string) {
    try {
      const user = this.prisma.user.findUnique({ where: { email } });
      return user;
    } catch (error) {
      console.log(error.message)
      return null
    }
  }
  async getUsers() {
    return this.prisma.user.findMany();
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
  // ✅ Create a new project
  async createProject(userId: string, name: string, type: 'WEB_SERVICE' | 'STATIC_SITE') {
    const project = await this.prisma.project.create({
      data: {
        name,
        type,
        userId,
      },
    });

    return { message: 'Project created successfully', project };
  }
  // ✅ Add a deploy to a project
  async addDeployToProject(projectId: string, deployId: string) {
    await this.prisma.deploy.update({
      where: { id: deployId },
      data: { projectId },
    })
  }


}
