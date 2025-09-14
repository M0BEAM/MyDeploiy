import { Injectable, Logger } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { exec } from 'child_process';
import { promisify } from 'util';
import { rimraf } from 'rimraf';
import { LocalHostingService } from './local-hosting.service';
import * as fs from 'fs';
import * as crypto from 'crypto';

import { WebhookService } from './webhook/webhook.service';
import { LogsGateway } from './logs.gateway';
const execPromise = promisify(exec);

@Injectable()
export class QueueService {
  private logger = new Logger(QueueService.name);
  private deployQueue: Queue;
  protected port: number | null
  constructor(
    private localHostingService: LocalHostingService,
    private webHookService: WebhookService,
    private logsGateway: LogsGateway,
  ) {
    const connection = new Redis({
      host: 'redis', // Use "redis" for Docker, "localhost" for local testing
      port: 6379,
      maxRetriesPerRequest: null,
    })

    this.deployQueue = new Queue('deployments', { connection });

    new Worker(
      'deployments',
      async (job) => {
        await this.processDeployment(job.data);
      },
      { connection },
    );
    // Get the global WebSocket server instance
  }

  async addDeploymentJob(data: any) {
    await this.deployQueue.add('deploy', data);
    this.logger.log(`📦 Job added for ${data.subdomain} via ${data.method}`);
    this.logsGateway.sendLogMessage(data.subdomain, data.deployId, formatLogMessage('info', `📦 Job added for ${data.subdomain} via ${data.method}`));
  }

  private async processDeployment(data: any) {
    const { method, repoUrl, subdomain, deployId, type, category, auth, dockerImage, startCommand, envVars } = data;

    const deployDir = `./deployments/${subdomain}`;
    // Fetch environment variables from DB
    try {
      await this.cleanDeploymentDir(deployDir, subdomain, deployId);

      await this.cloneOrPullRepo(method, repoUrl, deployDir, subdomain, deployId, dockerImage, startCommand, auth, envVars);

      if (type === 'static') {
        await this.localHostingService.deployStaticSite(deployDir, subdomain, deployId);
      } else if (type === 'webservice') {
        await this.deployWebService(deployDir, subdomain, category, this.port, deployId);
      }
    } catch (error: any) {
      this.logger.error(`❌ Deployment failed: ${error.message}`);
      this.logsGateway.sendLogMessage(subdomain, deployId, formatLogMessage('error', `❌ Deployment failed: ${error.message}`));
      throw error;
    }
  }

  private async cleanDeploymentDir(deployDir: string, subdomain: string, deployId: string) {
    this.logger.log(`🧹 Cleaning deployment directory: ${deployDir}`);
    this.logsGateway.sendLogMessage(subdomain, deployId, formatLogMessage('info', `🧹 Cleaning deployment directory...`));
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
    await rimraf(deployDir);
  }

  private async cloneOrPullRepo(
    method: string,
    repoUrl: string,
    deployDir: string,
    subdomain: string,
    deployId: string,
    dockerImage?: string,
    startCommand?: string,
    auth?: string,
    envVars?: any,

  ) {


    if (method === "self_host") {
      if (auth) {
        this.webHookService.addGiteaWebhookPrivate(parseGiteaRepoUrl(repoUrl)?.repoOwner || "", parseGiteaRepoUrl(repoUrl)?.repoName || "", auth)
        // ✅ 4️⃣ Clone Repo Using SSH Instead of Token
        this.logger.log(`🔒 Cloning private repo with token`);
        this.logsGateway.sendLogMessage(subdomain, deployId, formatLogMessage('info', `🔒 Cloning private repo with token`));
        // Get access token using OAuth
        const accessToken = auth;
        if (!accessToken) throw new Error('token not found');

        // Clone using the token
        const formattedRepoUrl = repoUrl.replace('http://', '');
        await execPromise(`git clone http://${accessToken}@${formattedRepoUrl} ${deployDir}`);

      } else {
        this.webHookService.addGiteaWebhookPublic(parseGiteaRepoUrl(repoUrl)?.repoOwner || "", parseGiteaRepoUrl(repoUrl)?.repoName || "")
        this.logger.log(`📥 Cloning repo: ${repoUrl}`);
        this.logsGateway.sendLogMessage(subdomain, deployId, formatLogMessage('info', `📥 Cloning repo: ${repoUrl}`));
        await execPromise(`git clone ${repoUrl} ${deployDir}`);
      }
    } else if (method === 'gitUrl') {

      this.logger.log(`📥 Cloning repo: ${repoUrl}`);
      this.logsGateway.sendLogMessage(subdomain, deployId, formatLogMessage('info', `📥 Cloning repo: ${repoUrl}`));
      await execPromise(`git clone ${repoUrl} ${deployDir}`);
    }
    else if (method === 'dockerUrl') {
      // this.io.emit('deployment-status', { deployId: subdomain, message: '🐳 Pulling Docker image...' });

      this.logger.log(`🐳 Pulling Docker image: ${dockerImage}`);
      this.logsGateway.sendLogMessage(subdomain, deployId, formatLogMessage('info', `🐳 Pulling Docker image: ${dockerImage}`));
      await execPromise(`docker pull ${dockerImage}`);

      // await execPromise(`docker run -d --name ${subdomain} -p 8080:80 ${dockerImage}`);
    }
    else {
      throw new Error('Invalid deployment method');
    }

    try {
      if (envVars.length > 0) {
        const envContent = envVars.map(env => `${env.key}=${decrypt(env.value)}`).join('\n');
        await fs.writeFile(`${deployDir}/.env`, envContent, 'utf8', (err) => {
          if (err) {
            console.error('Error saving file:', err);
          } else {
            console.log('File saved successfully!');
          }
        });
      }
      this.port = detectPortFromProject(deployDir, startCommand)

    } catch (error) {
      console.log(error.message)
    }
  }

  private async deployWebService(deployDir: string, subdomain: string, category: string, port: number | null, deployId: string) {

    this.logger.log(`⚙️ Processing web service: ${category}`);
    this.logsGateway.sendLogMessage(subdomain, deployId, formatLogMessage('info', `⚙️ Processing web service: ${category}`));

    if (category === 'frontend') {
      this.logsGateway.sendLogMessage(subdomain, deployId, formatLogMessage('info', `📦 Installing dependencies...`));

      await execPromise(`cd ${deployDir} && npm install`);

      this.logger.log(`🎨 Building frontend app: ${subdomain}`);
      this.logsGateway.sendLogMessage(subdomain, deployId, formatLogMessage('info', `🎨 Building frontend app: ${subdomain}`));
      await execPromise(`cd ${deployDir} && npm run build`);
      await this.localHostingService.deployStaticSite(`${deployDir}/build`, subdomain, deployId);
    } else if (category === 'backend') {
      await this.localHostingService.deployWebService(deployDir, subdomain, this.port, deployId);
    }
  }

}


function detectPortFromFile(appFilePath: string): number | null {
  if (!fs.existsSync(appFilePath)) return null;

  const content = fs.readFileSync(appFilePath, 'utf-8');

  // Match patterns:
  // - `process.env.PORT || <number>`
  // - `const port = <number>`, `let port = <number>`, `var port = <number>`
  const match = content.match(/process\.env\.PORT\s*\|\|\s*(\d+)/) ||
    content.match(/\b(?:const|let|var)\s+port\s*=\s*(\d+)/);

  return match ? parseInt(match[1], 10) : null;
}



// **Combined function to detect port**
function detectPortFromProject(deployDir: string, startCommand: string | undefined): number | null {
  const entryFile = `${deployDir}/${startCommand?.split(" ")[1]}`
  if (!entryFile) return null;

  return detectPortFromFile(entryFile);
}


function parseGiteaRepoUrl(repoUrl: string) {
  try {
    const url = new URL(repoUrl);
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts.length < 2) {
      throw new Error('Invalid repository URL');
    }

    const repoOwner = parts[0]; // First part = owner (user/org)
    const repoName = parts[1].replace(/\.git$/, ''); // Second part = repo name (remove .git if exists)

    return { repoOwner, repoName };
  } catch (error) {
    console.error('Failed to parse repo URL:', error.message);
    return null;
  }
}

function formatLogMessage(level: string, message: string): string {
  const now = new Date();
  const date = now.toISOString().replace('T', ' ').split('.')[0];
  return `${date} => [${level.toUpperCase()}] ${message}`;
}


const ALGORITHM = 'aes-256-cbc';
// Ensure SECRET_KEY is always 32 bytes
const SECRET_KEY = crypto.scryptSync(process.env.ENV_SECRET_KEY || "my-secret", 'salt', 32);
// Ensure IV is always 16 bytes (generate from ENV or fallback to a secure random value)
const IV = process.env.ENV_SECRET_IV
  ? Buffer.from(process.env.ENV_SECRET_IV, 'hex')
  : crypto.randomBytes(16);

function decrypt(value: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
  let decrypted = decipher.update(value, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}