import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'healthy',
      service: 'database-backup-restore',
      port: process.env.PORT || 3045,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Service information' })
  @ApiResponse({ status: 200, description: 'Service information' })
  getInfo() {
    return {
      service: 'LeafyHealth Database Backup & Restore Service',
      version: '1.0.0',
      description: 'Professional PostgreSQL backup and restore with Google Cloud Storage',
      endpoints: {
        health: '/health',
        docs: '/api/docs',
        backup: '/backup',
        restore: '/restore',
      },
    };
  }
}