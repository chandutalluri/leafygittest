const express = require('express');
const app = express();
const PORT = 8085;

// Health endpoint
app.get('/api/auth/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'authentication-service',
    port: PORT,
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/verify',
      '/api/auth/health'
    ]
  });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🔐 Authentication Service running on port ${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/api/auth/health`);
});
