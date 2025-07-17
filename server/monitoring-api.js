const express = require('express');
const cors = require('cors');
const os = require('os');
const { Pool } = require('pg');

const app = express();
const port = 3029;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'monitoring-api',
    timestamp: new Date()
  });
});

// Calculate CPU usage
function getCpuUsage() {
  const cpus = os.cpus();
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

// Get system metrics
async function getSystemMetrics() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  
  return {
    timestamp: new Date(),
    system: {
      cpu: {
        count: os.cpus().length,
        usage: getCpuUsage(),
        loadAverage: os.loadavg()
      },
      memory: {
        total: totalMemory,
        free: freeMemory,
        used: usedMemory,
        percentage: (usedMemory / totalMemory) * 100
      },
      uptime: os.uptime()
    },
    services: await checkServices(),
    database: await getDatabaseMetrics()
  };
}

// Check critical services
async function checkServices() {
  const services = [
    { name: 'Auth Service', port: 8085 },
    { name: 'Data Gateway', port: 8081 },
    { name: 'Company Management', port: 3013 },
    { name: 'Order Management', port: 3030 },
    { name: 'Payment Processing', port: 3031 }
  ];

  const results = await Promise.all(
    services.map(async (service) => {
      try {
        const startTime = Date.now();
        const response = await fetch(`http://127.0.0.1:${service.port}/health`, {
          timeout: 2000
        });
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

// Get database metrics
async function getDatabaseMetrics() {
  try {
    const connectionResult = await pool.query(`
      SELECT COUNT(*) as active_connections 
      FROM pg_stat_activity 
      WHERE state = 'active'
    `);

    const sizeResult = await pool.query(`
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

// Calculate health score
function calculateHealthScore(metrics) {
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
  const unhealthyServices = metrics.services.filter(s => s.status !== 'healthy').length;
  score -= unhealthyServices * 15;

  // Database health impact
  if (!metrics.database.healthy) score -= 25;

  return Math.max(0, Math.min(100, score));
}

// API endpoints
app.get('/api/docs', (req, res) => {
  res.json({
    service: 'Monitoring API',
    version: '1.0.0',
    endpoints: [
      { method: 'GET', path: '/health', description: 'Health check' },
      { method: 'GET', path: '/metrics', description: 'Get current system metrics' },
      { method: 'GET', path: '/dashboard', description: 'Get dashboard overview' }
    ]
  });
});

app.get('/metrics', async (req, res) => {
  try {
    const metrics = await getSystemMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/dashboard', async (req, res) => {
  try {
    const metrics = await getSystemMetrics();
    const healthScore = calculateHealthScore(metrics);
    
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
    
    const offlineServices = metrics.services.filter(s => s.status === 'offline');
    if (offlineServices.length > 0) {
      alerts.push({
        level: 'critical',
        message: `${offlineServices.length} service(s) offline`,
        services: offlineServices.map(s => s.name)
      });
    }
    
    if (healthScore < 60) {
      alerts.push({
        level: 'critical',
        message: 'System health is critical'
      });
    }
    
    res.json({
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
        healthy: metrics.services.filter(s => s.status === 'healthy').length,
        details: metrics.services
      },
      database: metrics.database,
      alerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, '127.0.0.1', () => {
  console.log(`📊 Monitoring API running on port ${port}`);
  console.log(`📈 Real-time metrics available at /metrics and /dashboard`);
});