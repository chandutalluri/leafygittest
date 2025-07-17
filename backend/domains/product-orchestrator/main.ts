import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ProductOrchestratorModule } from './product-orchestrator.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductOrchestratorModule);

  // Enable CORS for all origins (development)
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Product Orchestrator Service')
    .setDescription('Composite product creation service that orchestrates multiple microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3042;
  await app.listen(port, '127.0.0.1');
  
  console.log(`🚀 Product Orchestrator Service running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`❤️  Health check: http://localhost:${port}/health`);
}

bootstrap().catch(console.error);