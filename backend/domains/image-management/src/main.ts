import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ImageManagementController } from './controllers/image-management.controller';

@Module({
  controllers: [ImageManagementController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  const PORT = process.env.PORT || 3035;
  await app.listen(PORT, '127.0.0.1');
  console.log(`🚀 Image Management Service running on port ${PORT}`);
  console.log(`📁 Images directory: ${process.cwd()}/uploads/images`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/image-management/health`);
  console.log(`📊 Stats endpoint: http://localhost:${PORT}/api/image-management/stats`);
}

bootstrap().catch(err => {
  console.error('❌ Failed to start Image Management Service:', err);
  process.exit(1);
});