import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import * as os from 'os';

@Injectable()
export class MetricsCollectorService {
  private pool: Pool;
  private metricsHistory: any[] = [];
  private readonly MAX_HISTORY = 100;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    
    // Collect metrics every 30 seconds
    setInterval(() => this.collectMetrics(), 30000);
  }

  async collectMetrics() {
    const metrics = {
      timestamp: new Date(),
      system: await this.getSystemMetrics(),
      database: await this.getDatabaseMetrics(),
      services: await this.getServiceMetrics(),
      api: await this.getApiMetrics()
    };

    this.metricsHistory.push(metrics);
    if (this.metricsHistory.length > this.MAX_HISTORY) {
      this.metricsHistory.shift();
    }

    // Store critical metrics in database
    await this.storeMetrics(metrics);
    
    return metrics;
  }

  private async getSystemMetrics() {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    
    return {
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
    };
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

    return 100 - ~~(100 * totalIdle / totalTick);
  }

  private async getDatabaseMetrics() {
    try {
      const connectionCount = await this.pool.query(`
        SELECT COUNT(*) as active_connections 
        FROM pg_stat_activity 
        WHERE state = 'active'
      `);

      const databaseSize = await this.pool.query(`
        SELECT pg_database_size(current_database()) as size
      `);

      const tableStats = await this.pool.query(`
        SELECT 
          schemaname,
          tablename,
          n_live_tup as row_count,
          n_dead_tup as dead_rows,
          last_autovacuum
        FROM pg_stat_user_tables
        ORDER BY n_live_tup DESC
        LIMIT 10
      `);

      return {
        activeConnections: parseInt(connectionCount.rows[0].active_connections),
        databaseSize: parseInt(databaseSize.rows[0].size),
        topTables: tableStats.rows,
        queryStats: await this.getQueryStats()
      };
    } catch (error) {
      console.error('Database metrics error:', error);
      return null;
    }
  }

  private async getQueryStats() {
    try {
      const slowQueries = await this.pool.query(`
        SELECT 
          calls,
          total_exec_time,
          mean_exec_time,
          query
        FROM pg_stat_statements
        WHERE query NOT LIKE '%pg_stat%'
        ORDER BY mean_exec_time DESC
        LIMIT 5
      `);
      return slowQueries.rows;
    } catch (error) {
      // pg_stat_statements might not be enabled
      return [];
    }
  }

  private async getServiceMetrics() {
    const services = [
      { name: 'auth-service', port: 8085 },
      { name: 'data-gateway', port: 8081 },
      { name: 'company-management', port: 3013 },
      { name: 'catalog-management', port: 3022 },
      { name: 'order-management', port: 3030 },
      { name: 'payment-processing', port: 3031 },
      { name: 'inventory-management', port: 3025 }
    ];

    const healthChecks = await Promise.all(
      services.map(async (service) => {
        try {
          const response = await fetch(`http://127.0.0.1:${service.port}/health`);
          return {
            name: service.name,
            port: service.port,
            status: response.ok ? 'healthy' : 'unhealthy',
            responseTime: response.headers.get('x-response-time') || 'N/A'
          };
        } catch (error) {
          return {
            name: service.name,
            port: service.port,
            status: 'offline',
            responseTime: 'N/A'
          };
        }
      })
    );

    return healthChecks;
  }

  private async getApiMetrics() {
    try {
      const result = await this.pool.query(`
        SELECT 
          endpoint,
          method,
          COUNT(*) as request_count,
          AVG(response_time) as avg_response_time,
          MAX(response_time) as max_response_time,
          SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count
        FROM api_metrics
        WHERE timestamp > NOW() - INTERVAL '1 hour'
        GROUP BY endpoint, method
        ORDER BY request_count DESC
        LIMIT 10
      `);
      
      return result.rows;
    } catch (error) {
      // Table might not exist yet
      return [];
    }
  }

  private async storeMetrics(metrics: any) {
    try {
      await this.pool.query(`
        INSERT INTO performance_metrics (
          timestamp, 
          cpu_usage, 
          memory_usage, 
          active_connections,
          api_response_time,
          error_rate
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        metrics.timestamp,
        metrics.system.cpu.usage,
        metrics.system.memory.percentage,
        metrics.database?.activeConnections || 0,
        0, // Will be calculated from API metrics
        0  // Will be calculated from API metrics
      ]);
    } catch (error) {
      // Table might not exist yet
      console.error('Store metrics error:', error);
    }
  }

  async getLatestMetrics() {
    if (this.metricsHistory.length === 0) {
      return await this.collectMetrics();
    }
    return this.metricsHistory[this.metricsHistory.length - 1];
  }

  async getMetricsHistory() {
    return this.metricsHistory;
  }

  async getHealthScore() {
    const latest = await this.getLatestMetrics();
    let score = 100;

    // Deduct points for high resource usage
    if (latest.system.memory.percentage > 80) score -= 20;
    if (latest.system.cpu.usage > 80) score -= 20;
    
    // Deduct points for offline services
    if (latest.services) {
      const offlineCount = latest.services.filter((s: any) => s.status === 'offline').length;
      score -= offlineCount * 10;
    }

    // Deduct points for high database connections
    if (latest.database?.activeConnections > 50) score -= 10;

    return Math.max(0, score);
  }
}