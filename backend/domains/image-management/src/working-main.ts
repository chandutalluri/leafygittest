import { NestFactory } from '@nestjs/core';
import { WorkingAppModule } from './working-app.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkingAppModule);
  
  // Enable CORS for all origins
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });

  const port = process.env.PORT || 3035;
  await app.listen(port, '127.0.0.1');
  
  console.log('🚀 Image Management Service running on port', port);
  console.log('📚 API Documentation: http://localhost:' + port + '/api/docs');
}

bootstrap();