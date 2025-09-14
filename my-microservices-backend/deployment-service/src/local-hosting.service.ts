// src/local-hosting.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as net from 'net';
import { exec } from 'child_process';
import { promisify } from 'util';
import { saveBackendPortMapping } from './port-mapping.util'; // The helper functions from above
import { LogsGateway } from './logs.gateway';
import { DeployService } from 'deploy/deploy.service';
import { PrismaService } from 'prisma/prisma.service';

const execPromise = promisify(exec);

@Injectable()
export class LocalHostingService {
  private logger = new Logger(LocalHostingService.name);
  // Directory where deployed static sites are stored
  private hostingDir: string;
  // The public hostname of your platform (e.g., https://myplatform.com)
  private platformHostname: string;

  // Port manager for handling port assignments
  private portManager: any; // Replace 'any' with the actual type if available

  // In QueueService, add a port mapping or generate one dynamically.
  private backendPortMapping: { [subdomain: string]: { requestPort: number } } = {};


  constructor(
    private logsGateway: LogsGateway,
  ) {
    // Set your hosting directory and public hostname via environment variables.
    // For example, HOSTING_DIRECTORY might be "./public/sites" and PLATFORM_HOSTNAME "http://localhost:3000" (or your domain).
    this.hostingDir = process.env.HOSTING_DIRECTORY || path.join(process.cwd(), 'public', 'sites');
    this.platformHostname = process.env.PLATFORM_HOSTNAME || 'http://localhost:3010';
    // Ensure the hosting directory exists.
    fs.ensureDirSync(this.hostingDir);
  }
  // Helper: Ensure a Dockerfile exists, or generate a default one.
  private async ensureDockerfile(deployDir: string, assignedPort: number | null): Promise<void> {
    const dockerfilePath = path.join(deployDir, 'Dockerfile');

    if (!await fs.pathExists(dockerfilePath)) {
      const packageJsonPath = path.join(deployDir, 'package.json');
      let startCommand = 'node server.js'; // Default fallback

      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        if (packageJson.scripts?.start) {
          startCommand = 'npm run start';
        }
      }

      // Properly format the CMD instruction
      const cmdParts = startCommand.split(' ');
      const formattedCmd = cmdParts.map(part => `"${part}"`).join(', ');

      const defaultDockerfile = `
# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install only production dependencies (fallback to full install if lock file is missing)
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --only=production; fi  

# Copy the entire app
COPY . .

# Set environment variable for the port
ENV PORT=${assignedPort}

# Expose the port
EXPOSE ${assignedPort}

# Start the application
CMD [ ${formattedCmd} ]
      `;

      await fs.writeFile(dockerfilePath, defaultDockerfile.trim(), 'utf8');
      this.logger.log(`📄 Default Dockerfile created at ${dockerfilePath}`);
    }
  }

  async deployStaticSite(buildDir: string, subdomain: string,deployId:string): Promise<void> {
    // The destination folder for the deployed site (e.g., ./public/sites/myapp)
    const destination = path.join(this.hostingDir, subdomain);
    // Remove any existing site, then copy over the new build files.
    await fs.remove(destination);
    await fs.copy(buildDir, destination);
    // socket.emit('deployment-status', { deployId: subdomain, message: '✅ Your web service is now live!' });
    this.logsGateway.sendLogMessage(subdomain,deployId, formatLogMessage('info', `✅ Your static site is now live!`));
  
    this.logger.log(`✅ Your static site is now live!`);
    // Construct the URL for the deployed site. For example, if your server serves "public" as the web root,
    // then the URL might be "http://localhost:3000/sites/myapp/index.html"

  }

  async deployWebService(buildDir: string, subdomain: string, userPort: number | null,deployId:string): Promise<void> {
    let internalPort = userPort
    this.logger.log(`📦 Preparing to deploy your web service: ${subdomain}`);
    this.logsGateway.sendLogMessage(subdomain,deployId, formatLogMessage('info', `📦 Preparing to deploy your web service: ${subdomain}`));

    // Install dependencies
    this.logger.log(`📂 Installing dependencies for ${subdomain}...`);
    this.logsGateway.sendLogMessage(subdomain,deployId, formatLogMessage('info', `📂 Installing dependencies for ${subdomain}...`));

    await execPromise(`cd "${buildDir}" && npm install`);

    // Determine assigned port
    let assignedPort = userPort || 4000
    // Check if the port is already in use
    if (await isPortInUse(userPort)) {
      this.logger.log(`⚠️ Port ${userPort} is already in use. Assigning a new port...`);
      assignedPort = await getAvailablePort(4000, this.backendPortMapping);

    }

    // Save the mapping
    this.backendPortMapping[subdomain] = { requestPort: assignedPort };
    await saveBackendPortMapping(this.backendPortMapping);

    // Ensure a Dockerfile exists
    await this.ensureDockerfile(buildDir, internalPort);

    // Stop any existing service (if running)
    await execPromise(`docker stop ${subdomain} && docker rm ${subdomain}`).catch(() => { });

    // Build the service
    this.logger.log(`🔨 Building your web service on docker image ...`);
    this.logsGateway.sendLogMessage(subdomain,deployId, formatLogMessage('info', `🔨 Building your web service on docker image ...`));

    await execPromise(`cd "${buildDir}" && docker build -t ${subdomain}-image .`);

    // Run the service with the assigned port
    this.logger.log(`🚀 Running your web service on port ${assignedPort}...`);
    this.logsGateway.sendLogMessage(subdomain,deployId, formatLogMessage('info', `🚀 Running your web service on container ...`));

    await execPromise(`docker run -d --name ${subdomain} -p ${assignedPort}:${internalPort} ${subdomain}-image`);
    this.logsGateway.sendLogMessage(subdomain,deployId, formatLogMessage('info', `✅ Your web service is now live!`));

    this.logger.log(`✅ Your web service is now live!`);
  }

}


async function isPortInUse(port: number | null): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}


// Function to find the next available unique port
async function getAvailablePort(startPort: number = 4000, backendPortMapping: any): Promise<number> {
  let port = startPort;

  // Get the set of all used ports from backendPortMapping
  const usedPorts = new Set(
    Object.values(backendPortMapping).map((entry: { requestPort: number }) => entry.requestPort)
  );

  // Keep increasing the port number until a free and unique one is found
  while (await isPortInUse(port) || usedPorts.has(port)) {
    port++;
  }

  return port;
}


function formatLogMessage(level: string, message: string): string {
  const now = new Date();
  const date = now.toISOString().replace('T', ' ').split('.')[0];
  return `${date} => [${level.toUpperCase()}] ${message}`;
}

async function getContainerMetrics(subdomain: string): Promise<{ cpu: string; memory: string }> {
  return new Promise((resolve, reject) => {
    exec(`docker stats ${subdomain} --no-stream --format "{{.CPUPerc}} {{.MemUsage}}"`, (error, stdout) => {
      if (error) {
        return reject(error);
      }
      const [cpu, memory] = stdout.trim().split(" ");
      resolve({ cpu, memory });
    });
  });
}

