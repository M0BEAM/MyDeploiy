// metric.service.ts
import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { PrismaService } from 'prisma/prisma.service';
import { Observable, Subscriber } from 'rxjs';

interface ContainerMetrics {
  cpu: number;
  memory: number;
  network: number;
  timestamp: string;
}

@Injectable()
export class MetricService {
  private readonly METRIC_INTERVAL_MS = 2000;
  private readonly DOCKER_STATS_HEADERS = ['Name', 'CPUPerc', 'MemUsage', 'NetIO'];

  constructor(private prisma: PrismaService) {}

  getContainerMetricsStream(subdomain: string, deployId: string): Observable<ContainerMetrics> {
    return new Observable(subscriber => {
      const dockerStats = spawn('docker', [
        'stats',
        subdomain,
        '--no-stream',
        '--format',
        '{{.Name}},{{.CPUPerc}},{{.MemUsage}},{{.NetIO}}'
      ]);

      const interval = setInterval(async () => {
        try {
          const metrics = await this.getContainerMetrics(subdomain, deployId);
          subscriber.next(metrics);
        } catch (error) {
          subscriber.error(error);
        }
      }, this.METRIC_INTERVAL_MS);

      return () => {
        clearInterval(interval);
        dockerStats.kill();
      };
    });
  }

  private async getContainerMetrics(containerName: string, deployId: string): Promise<ContainerMetrics> {
    try {
      const stats = await this.executeDockerStats(containerName);
      const metrics = this.parseDockerStats(stats);
      
      await this.prisma.metric.create({
        data: {
          deployId,
          cpu: metrics.cpu,
          memory: metrics.memory,
          network: metrics.network,
          timestamp: new Date(metrics.timestamp)
        }
      });

      return metrics;
    } catch (error) {
      console.error('Error getting container metrics:', error);
      throw error;
    }
  }

  private async executeDockerStats(containerName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const dockerStats = spawn('docker', [
        'stats',
        containerName,
        '--no-stream',
        '--format',
        '{{.Name}},{{.CPUPerc}},{{.MemUsage}},{{.NetIO}}'
      ]);

      let output = '';
      dockerStats.stdout.on('data', (data) => output += data.toString());
      dockerStats.stderr.on('data', (data) => reject(data.toString()));
      dockerStats.on('close', (code) => code === 0 ? resolve(output) : reject(`Exited with code ${code}`));
    });
  }

  private parseDockerStats(output: string): ContainerMetrics {
    const [name, cpuPerc, memUsage, netIO] = output.trim().split(',');
    
    return {
      cpu: parseFloat(cpuPerc.replace('%', '')) || 0,
      memory: parseFloat(memUsage.split('/')[0].replace(/[^\d.]/g, '')) || 0,
      network: this.parseNetworkUsage(netIO),
      timestamp: new Date().toISOString()
    };
  }

  private parseNetworkUsage(netIO: string): number {
    const [inbound, outbound] = netIO.split('/').map(s => 
      parseFloat(s.replace(/[^\d.]/g, '')) || 0
    );
    return (inbound + outbound) / 2;
  }

  async getHistoricalMetrics(deployId: string): Promise<ContainerMetrics[]> {
    return (await this.prisma.metric.findMany({
      where: { deployId },
      orderBy: { timestamp: 'asc' },
      take: 30 // Return last 30 data points
    })).map((metric) => ({
      cpu: metric.cpu,
      memory: metric.memory,
      network: metric.network,
      timestamp: metric.timestamp.toISOString(), // Convert Date to string
    }));
  }
}