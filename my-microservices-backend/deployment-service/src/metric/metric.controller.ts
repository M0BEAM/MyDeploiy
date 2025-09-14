// metric.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricService } from './metric.service';

@Controller('metrics')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Get(':subdomain/deploy/:deployId')
  async streamMetrics(
    @Param('subdomain') subdomain: string,
    @Param('deployId') deployId: string,
    @Res() res: Response
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = this.metricService.getContainerMetricsStream(subdomain, deployId);
    
    stream.subscribe({
      next: (metrics) => {
        res.write(`data: ${JSON.stringify(metrics)}\n\n`);
      },
      error: (error) => {
        console.error('Stream error:', error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      },
      complete: () => res.end()
    });

    res.on('close', () => {
      stream.subscribe();
      res.end();
    });
  }
}