import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { loadBackendPortMapping } from './port-mapping.util';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TCP Microservice

  // Global error handler for microservice
  app.useGlobalFilters({
    catch(exception: RpcException, host) {
      const logger = new Logger('GlobalExceptionFilter');
      logger.error(`Microservice error: ${exception.message}`);
      return throwError(() => exception.getError());
    },
  })
  app.enableCors({ origin: 'http://localhost:3000' });
  // Listen for client connections

  // Dynamic proxy middleware for backend services.
  app.use(async (req, res, next) => {

    const host = req.headers.host || ''; // e.g., "back1.localhost:3010"
    const parts = host.split('.');
    const subdomain = parts.length > 1 ? parts[0] : '';
    console.log('Host:', host);  // Debug Docker vs. host behavior
    console.log('Subdomain:', subdomain);
    try {
      // Read the mapping on every request
      const backendPortMapping = await loadBackendPortMapping();
      if (subdomain && backendPortMapping[subdomain] && backendPortMapping[subdomain].requestPort) {
        const targetPort = backendPortMapping[subdomain].requestPort;
        return createProxyMiddleware({
          target: `http://localhost:${targetPort}`,
          changeOrigin: true,
        })(req, res, next);
      }
    } catch (error) {
      console.error('Failed to load backend port mapping:Your app not found');
      return res.status(404).send('Your app not found');
    }

    // Otherwise, try to serve as static content if available
    const subdomainPath = path.join(process.cwd(), 'public', 'sites', subdomain);
    console.log('Docker static path check:', subdomainPath);
    if (fs.existsSync(subdomainPath)) {
      // console.log(`Serving static files for "${subdomain}" from ${subdomainPath}`);
      return express.static(subdomainPath)(req, res, () => {
        const indexPath = path.join(subdomainPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          next();
        }
      });
    }

    next();
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'my-microservices-backend-deployment-service-1', port: 3009 }, //0.0.0.0
  });
  app.setGlobalPrefix('api');
  await app.startAllMicroservices(); // Starts TCP microservice
  await app.listen(3010);
  console.log('Backend running on http://localhost:3010');
}

bootstrap();
