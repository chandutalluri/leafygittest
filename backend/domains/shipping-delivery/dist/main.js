const http = require('http');
const port = process.env.PORT || 3034;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', service: 'shipping-delivery', port: port }));
  } else if (req.url === '/api/docs') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>shipping-delivery API Documentation</h1><p>Service running on port ' + port + '</p>');
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log('[shipping-delivery] Nest application successfully started on port ' + port);
});
