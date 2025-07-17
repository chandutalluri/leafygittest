import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  health() {
    return {
      status: 'healthy',
      service: 'company-management',
      port: process.env.PORT || 3013,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}