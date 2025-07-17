import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { closeDatabase } from '../drizzle/db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3045;

  // Security middleware - temporarily disabled due to import issues
  // TODO: Re-enable helmet and compression after fixing CommonJS/ESM compatibility

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3003'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Database Backup & Restore API')
    .setDescription('Professional PostgreSQL backup and restore service with Google Cloud Storage')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, '127.0.0.1');
  console.log(`[database-backup-restore] Microservice is running on: http://127.0.0.1:${PORT}`);
  console.log(`[database-backup-restore] API documentation available at: http://127.0.0.1:${PORT}/api/docs`);

  // Graceful shutdown handling
  process.on('SIGINT', async () => {
    console.log('[database-backup-restore] Received SIGINT, shutting down gracefully...');
    await closeDatabase();
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('[database-backup-restore] Received SIGTERM, shutting down gracefully...');
    await closeDatabase();
    await app.close();
    process.exit(0);
  });
}

bootstrap().catch((error) => {
  console.error('[database-backup-restore] Failed to start service:', error);
  process.exit(1);
});