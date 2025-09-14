import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

 
  app.enableCors({
    origin: 'http://localhost:3000'
  });
  // Use a different port (e.g., 3011)
  await app.listen(3011);
  console.log('User service running on http://localhost:3011');
}
bootstrap();
