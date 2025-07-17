#!/usr/bin/env node

/**
 * REPLIT PREVIEW COMPATIBLE GATEWAY
 * Specially designed to work with Replit's iframe preview system
 * Removes all restrictions and security headers that could block iframe embedding
 */

const http = require('http');
const httpProxy = require('http-proxy-middleware');

const PORT = process.env.PORT || 5000;

// MINIMAL CORS - No restrictions for Replit preview
function setMinimalHeaders(res, origin) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // CRITICAL: NO security headers that could block iframe
  // NO X-Frame-Options
  // NO Content-Security-Policy restrictions
  // NO X-Content-Type-Options
}

// Simple frontend routing
const FRONTEND_ROUTES = {
  '/': 3000,           // ecommerce-web 
  '/customer': 3000,   // ecommerce-web
  '/mobile': 3001,     // ecommerce-mobile
  '/admin': 3002,      // admin-portal
  '/superadmin': 3003, // super-admin
  '/ops': 3004         // ops-delivery
};

// API routing to microservices
const API_ROUTES = {
  '/api/auth': 8085,
  '/api/direct-data': 8081,
  '/api/company-management': 3013,
  '/api/backup-restore': 3045
};

function createSimpleProxy(targetPort) {
  return httpProxy.createProxyMiddleware({
    target: `http://127.0.0.1:${targetPort}`,
    changeOrigin: true,
    ws: false, // Disable WebSocket to prevent connection issues
    timeout: 30000,
    logLevel: 'silent', // Reduce noise
    onError: (err, req, res) => {
      console.log(`Proxy error to port ${targetPort}: ${err.message}`);
      if (!res.headersSent) {
        setMinimalHeaders(res);
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('Service temporarily unavailable');
      }
    }
  });
}

// Create proxy instances
const frontendProxies = {};
const apiProxies = {};

Object.entries(FRONTEND_ROUTES).forEach(([route, port]) => {
  frontendProxies[route] = createSimpleProxy(port);
});

Object.entries(API_ROUTES).forEach(([route, port]) => {
  apiProxies[route] = createSimpleProxy(port);
});

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  
  // Always set minimal headers first
  setMinimalHeaders(res, req.headers.origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Health check
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    return;
  }
  
  // API routing
  for (const [apiRoute, port] of Object.entries(API_ROUTES)) {
    if (pathname.startsWith(apiRoute)) {
      console.log(`API: ${pathname} → :${port}`);
      return apiProxies[apiRoute](req, res);
    }
  }
  
  // Frontend routing
  for (const [frontendRoute, port] of Object.entries(FRONTEND_ROUTES)) {
    if (pathname === frontendRoute || (frontendRoute === '/' && pathname === '/')) {
      console.log(`Frontend: ${pathname} → :${port}`);
      return frontendProxies[frontendRoute](req, res);
    }
  }
  
  // Default to main frontend
  console.log(`Default: ${pathname} → :3000`);
  return frontendProxies['/'](req, res);
});

// CRITICAL: Bind to ALL interfaces for Replit preview
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 REPLIT PREVIEW GATEWAY running on port ${PORT}`);
  console.log(`🌐 Optimized for Replit iframe preview system`);
  console.log(`🔓 All security restrictions removed for preview compatibility`);
  console.log(`📱 Access: https://${process.env.REPLIT_DEV_DOMAIN || 'localhost'}:${PORT}`);
});

// Handle process cleanup
process.on('SIGTERM', () => {
  console.log('Gateway shutting down...');
  server.close();
});