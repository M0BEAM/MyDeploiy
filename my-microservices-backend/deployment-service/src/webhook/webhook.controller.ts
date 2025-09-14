import { Controller, Post, Headers, Body, Logger } from '@nestjs/common';
import { QueueService } from '../queue.service';
import { DeployService } from '../deploy/deploy.service';

@Controller('webhook')
export class WebhookController {
  private logger = new Logger(WebhookController.name);

  constructor(
    private queueService: QueueService,
    private deployService: DeployService
  ) { }

  @Post()
  async handleWebhook(@Headers('x-gitea-event') event: string, @Body() payload: any) {
    this.logger.log(`Webhook received from self-hosted Git: ${payload.repository?.html_url}`);
    console.log("webhook")
    if (!payload.ref || !payload.repository) {
      this.logger.warn('Invalid Git payload');
      return;
    }

    const repoUrl = payload.repository.clone_url;
     const data = this.deployService.getDeployInfoUsingRepoUrl(repoUrl)
    await this.queueService.addDeploymentJob({ repoUrl,...data });

    return { message: 'Deployment triggered!' };
  }
}
