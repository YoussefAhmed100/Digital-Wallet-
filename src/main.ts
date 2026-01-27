import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use('/webhooks/paytech', express.text({ type: 'text/plain' }))
  app.use('/webhooks/acme', express.text({ type: 'text/plain' }))
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
