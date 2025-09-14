import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getRoot(): string {
    return 'Welcome to the Deployment Service!';
  }


  @MessagePattern('deploy') // Must match client's pattern
  async handleDeploymentEvent(payload: any) {
    // Process the payload
    return { status: 'ACK' }; // Send a response
  }
}
