
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';

@Controller()
class HealthController {
  @Get('health')
  getHealth() {
    return { 
      status: 'ok', 
      service: 'identity-access',
      timestamp: new Date().toISOString()
    };
  }
  
  @Get()
  getInfo() {
    return {
      name: 'identity-access',
      version: '1.0.0',
      status: 'operational'
    };
  }
}

@Module({
  controllers: [HealthController]
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3020;
  await app.listen(port, '127.0.0.1');
  console.log(`IdentityAccess Service running on port ${port}`);
}

bootstrap();
