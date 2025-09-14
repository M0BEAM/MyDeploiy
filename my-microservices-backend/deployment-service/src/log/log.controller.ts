import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  metadata?: Record<string, unknown>;
}

@Controller('logs')
export class LogsController {
  constructor() {}

  private parseLogLine(line: string): LogEntry {
    // Basic line parsing
    const entry: LogEntry = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: line,
    };

    try {
      // Try to parse structured JSON logs
      const jsonLog = JSON.parse(line);
      return {
        ...entry,
        ...jsonLog,
        timestamp: jsonLog.time || entry.timestamp,
        message: jsonLog.msg || jsonLog.message || line,
      };
    } catch {
      // Fallback to string parsing
      const timestampMatch = line.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      const levelMatch = line.match(/\b(ERROR|WARN|INFO|DEBUG)\b/);
      
      return {
        ...entry,
        timestamp: timestampMatch?.[0] || entry.timestamp,
        level: (levelMatch?.[0] || 'INFO') as LogEntry['level'],
        message: line,
      };
    }
  }

  @Get(':subdomain')
  getLogs(@Param('subdomain') subdomain: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      // Start from beginning and follow
      const logProcess = spawn('docker', [
        'logs',
        '-f',
        '--tail',
        '100', // Show last 100 lines initially
        subdomain
      ]);

      const sendLog = (data: Buffer) => {
        const logLines = data.toString().split('\n');
        logLines.forEach(line => {
          if (line.trim()) {
            const logEntry = this.parseLogLine(line);
            res.write(`data: ${JSON.stringify(logEntry)}\n\n`);
          }
        });
      };

      logProcess.stdout.on('data', sendLog);
      logProcess.stderr.on('data', sendLog);

      logProcess.on('error', (error) => {
        console.error('Docker process error:', error);
        res.write(`data: ${JSON.stringify({
          id: randomUUID(),
          timestamp: new Date().toISOString(),
          level: 'ERROR',
          message: 'Docker process error'
        })}\n\n`);
      });

      res.on('close', () => {
        logProcess.kill();
      });

      // Send initial heartbeat
      res.write(':heartbeat\n\n');

    } catch (error) {
      console.error('Initialization error:', error);
      res.status(500).json({ 
        error: 'Failed to initialize log stream',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 