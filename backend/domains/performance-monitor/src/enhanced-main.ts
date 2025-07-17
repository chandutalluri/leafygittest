import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import * as os from 'os';

@Injectable()
class MetricsService {
  private pool: Pool;
  private metricsCache: any = null;
  private lastUpdate: Date | null = null;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  async getSystemMetrics() {
    const now = new Date();
    if (this.metricsCache && this.lastUpdate && (now.getTime() - this.lastUpdate.getTime()) < 5000) {
      return this.metricsCache;
    }

    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    
    const metrics = {
      timestamp: now,
      system: {
        cpu: {
          count: cpus.length,
          usage: this.calculateCpuUsage(cpus),
          loadAverage: os.loadavg()
        },
        memory: {
          total: totalMemory,
          free: freeMemory,
          used: totalMemory - freeMemory,
          percentage: ((totalMemory - freeMemory) / totalMemory) * 100
        },
        uptime: os.uptime()
      },
      services: await this.checkServices(),
      database: await this.getDatabaseMetrics()
    };

    this.metricsCache = metrics;
    this.lastUpdate = now;
    return metrics;
  }

  private calculateCpuUsage(cpus: any[]) {
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    return Math.round(100 - (100 * totalIdle / totalTick));
  }

  private async checkServices() {
    const criticalServices = [
      { name: 'Auth Service', port: 8085 },
      { name: 'Data Gateway', port: 8081 },
      { name: 'Company Management', port: 3013 }
    ];

    const results = await Promise.all(
      criticalServices.map(async (service) => {
        try {
          const startTime = Date.now();
          const response = await fetch(`http://127.0.0.1:${service.port}/health`);
          const responseTime = Date.now() - startTime;
          
          return {
            name: service.name,
            port: service.port,
            status: response.ok ? 'healthy' : 'unhealthy',
            responseTime
          };
        } catch (error) {
          return {
            name: service.name,
            port: service.port,
            status: 'offline',
            responseTime: -1
          };
        }
      })
    );

    return results;
  }

  private async getDatabaseMetrics() {
    try {
      const connectionResult = await this.pool.query(`
        SELECT COUNT(*) as active_connections 
        FROM pg_stat_activity 
        WHERE state = 'active'
      `);

      const sizeResult = await this.pool.query(`
        SELECT pg_database_size(current_database()) as size
      `);

      return {
        activeConnections: parseInt(connectionResult.rows[0].active_connections),
        databaseSize: parseInt(sizeResult.rows[0].size),
        healthy: true
      };
    } catch (error) {
      return {
        activeConnections: 0,
        databaseSize: 0,
        healthy: false,
        error: error.message
      };
    }
  }

  calculateHealthScore(metrics: any) {
    let score = 100;

    // Memory usage impact
    if (metrics.system.memory.percentage > 90) score -= 30;
    else if (metrics.system.memory.percentage > 80) score -= 20;
    else if (metrics.system.memory.percentage > 70) score -= 10;

    // CPU usage impact
    if (metrics.system.cpu.usage > 90) score -= 30;
    else if (metrics.system.cpu.usage > 80) score -= 20;
    else if (metrics.system.cpu.usage > 70) score -= 10;

    // Service health impact
    const unhealthyServices = metrics.services.filter((s: any) => s.status !== 'healthy').length;
    score -= unhealthyServices * 15;

    // Database health impact
    if (!metrics.database.healthy) score -= 25;

    return Math.max(0, Math.min(100, score));
  }
}

@Controller()
class HealthController {
  @Get('health')
  getHealth() {
    return { 
      status: 'ok', 
      service: 'performance-monitor',
      timestamp: new Date()
    };
  }
  
  @Get('api/docs')
  getApiDocs() {
    return {
      service: 'Performance Monitor Service',
      version: '2.0.0',
      endpoints: [
        { method: 'GET', path: '/health', description: 'Health check' },
        { method: 'GET', path: '/metrics', description: 'Get current system metrics' },
        { method: 'GET', path: '/dashboard', description: 'Get dashboard overview' }
      ]
    };
  }
}

@Controller('metrics')
class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics() {
    return await this.metricsService.getSystemMetrics();
  }
}

@Controller('dashboard')
class DashboardController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getDashboard() {
    const metrics = await this.metricsService.getSystemMetrics();
    const healthScore = this.metricsService.calculateHealthScore(metrics);
    
    return {
      overview: {
        healthScore,
        status: healthScore >= 80 ? 'Healthy' : healthScore >= 60 ? 'Warning' : 'Critical',
        lastUpdated: metrics.timestamp
      },
      system: {
        cpu: `${metrics.system.cpu.usage}%`,
        memory: `${metrics.system.memory.percentage.toFixed(1)}%`,
        uptime: `${Math.floor(metrics.system.uptime / 3600)} hours`
      },
      services: {
        total: metrics.services.length,
        healthy: metrics.services.filter((s: any) => s.status === 'healthy').length,
        details: metrics.services
      },
      database: metrics.database,
      alerts: this.generateAlerts(metrics, healthScore)
    };
  }

  private generateAlerts(metrics: any, healthScore: number) {
    const alerts = [];
    
    if (metrics.system.memory.percentage > 80) {
      alerts.push({
        level: 'warning',
        message: `High memory usage: ${metrics.system.memory.percentage.toFixed(1)}%`
      });
    }
    
    if (metrics.system.cpu.usage > 80) {
      alerts.push({
        level: 'warning',
        message: `High CPU usage: ${metrics.system.cpu.usage}%`
      });
    }
    
    const offlineServices = metrics.services.filter((s: any) => s.status === 'offline');
    if (offlineServices.length > 0) {
      alerts.push({
        level: 'critical',
        message: `${offlineServices.length} service(s) offline`,
        services: offlineServices.map((s: any) => s.name)
      });
    }
    
    if (healthScore < 60) {
      alerts.push({
        level: 'critical',
        message: 'System health is critical'
      });
    }
    
    return alerts;
  }
}

@Module({
  controllers: [HealthController, MetricsController, DashboardController],
  providers: [MetricsService]
})
class EnhancedAppModule {}

async function bootstrap() {
  const app = await NestFactory.create(EnhancedAppModule);
  app.enableCors();
  const port = process.env.PORT || 3029;
  await app.listen(port, '127.0.0.1');
  console.log(`📊 Enhanced Performance Monitor running on port ${port}`);
  console.log(`📈 Real-time metrics available at /metrics and /dashboard`);
}

bootstrap();