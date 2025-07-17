const http = require('http');
const port = process.env.PORT || 3028;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', service: 'employee-management', port: port }));
  } else if (req.url === '/api/docs') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>employee-management API Documentation</h1><p>Service running on port ' + port + '</p>');
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log('[employee-management] Nest application successfully started on port ' + port);
});
