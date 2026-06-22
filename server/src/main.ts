import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger as NestLogger } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  // Enable CORS
  app.enableCors();

  // Serve static files from uploads folder
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Set global API prefix
  app.setGlobalPrefix('admin-api');

  // Register validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  new NestLogger('Bootstrap').log(
    `Application is running on: http://localhost:${port}/admin-api`,
  );
}
bootstrap();
