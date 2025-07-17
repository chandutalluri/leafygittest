import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('LeafyHealth Professional Label Design & Printing System')
      .setDescription('Corporate-grade label design, printing, and verification system with full product integration')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3027;
    await app.listen(port, '127.0.0.1');
    console.log(`🏷️  Professional Label Design & Printing Service running on port ${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🔗 Health Check: http://localhost:${port}/labels/health`);
    console.log(`🎯 13 Media Types | 4 Professional Templates | Full Integration Ready`);
  } catch (error) {
    console.error(`❌ Failed to start label-design service:`, error);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error(`❌ label-design bootstrap error:`, err);
  process.exit(1);
});