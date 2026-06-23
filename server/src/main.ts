import { ZodValidationPipe, cleanupOpenApiDoc } from 'nestjs-zod';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger as NestLogger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
  app.useGlobalPipes(new ZodValidationPipe());

  // Setup Swagger API documentation in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Bold Bose Admin API')
      .setDescription('Bold Bose 管理后台接口文档')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: '请输入登录后获取的 JWT Token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const cleanDocument = cleanupOpenApiDoc(document);
    SwaggerModule.setup('admin-api/docs', app, cleanDocument);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  new NestLogger('Bootstrap').log(
    `Application is running on: http://localhost:${port}/admin-api`,
  );
}
bootstrap();
