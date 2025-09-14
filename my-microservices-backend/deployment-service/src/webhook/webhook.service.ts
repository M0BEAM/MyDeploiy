import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebhookService {
  private GITEA_API_URL = 'http://localhost:3000/api/v1';

  constructor(private httpService: HttpService) { }

  // ✅ 1️⃣ Function for Private Repos (Requires Token)
  async addGiteaWebhookPrivate(repoOwner: string, repoName: string, token: string) {
    return this.addGiteaWebhook(repoOwner, repoName, token);
  }

  // ✅ 2️⃣ Function for Public Repos (No Token)
  async addGiteaWebhookPublic(repoOwner: string, repoName: string) {
    return this.addGiteaWebhook(repoOwner, repoName);
  }

  // ✅ Reusable Function to Add Webhook
  private async addGiteaWebhook(repoOwner: string, repoName: string, token?: string) {
    const webhookUrl = 'https://6081-165-51-148-136.ngrok-free.app/webhook/';

    const payload = {
      type: 'gitea',
      config: {
        url: webhookUrl,
        content_type: 'json',
      },
      events: ['push'],
      active: true,
    };

    const apiUrl = `${this.GITEA_API_URL}/repos/${repoOwner}/${repoName}/hooks`;

    try {
      const headers: Record<string, string> = {};

      if (token) {
        headers.Authorization = `token ${token}`;  // ✅ Required for private repos
      }

      const response = await firstValueFrom(this.httpService.post(apiUrl, payload, { headers }));
      return response.data;
    } catch (error) {
      console.error('Failed to add Gitea webhook:', error.response?.data || error.message);
      throw error;
    }
  }
}
