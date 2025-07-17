const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8085;

app.use(cors());
app.use(express.json());

app.get('/api/auth/health', (req, res) => {
  res.json({ status: 'healthy', service: 'authentication-service', port: PORT });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, token: 'demo_token', user: { email: req.body.email, role: 'customer' } });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🔐 Authentication Service running on port ${PORT}`);
});
