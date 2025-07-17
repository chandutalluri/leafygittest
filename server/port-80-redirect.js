/**
 * Port 80 Redirect Service for Replit Preview Fix
 * Redirects external port 80 traffic to internal port 5000
 */

const http = require('http');
const httpProxy = require('http-proxy-middleware');

const proxy = httpProxy.createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Port 80 Redirect] ${req.method} ${req.url} → http://localhost:5000${req.url}`);
  },
  onError: (err, req, res) => {
    console.error(`[Port 80 Redirect] Proxy error: ${err.message}`);
    res.writeHead(500);
    res.end('Proxy Error');
  }
});

const server = http.createServer(proxy);

server.listen(80, '0.0.0.0', () => {
  console.log('🔄 Port 80 Redirect Service running');
  console.log('📡 Redirecting http://localhost:80 → http://localhost:5000');
  console.log('🎯 This should fix Replit preview "refused to connect" issue');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('⚠️  Port 80 already in use - this is normal if you have permissions');
  } else if (err.code === 'EACCES') {
    console.log('⚠️  Port 80 requires elevated permissions - fix .replit file instead');
  } else {
    console.error('❌ Port 80 redirect error:', err.message);
  }
});