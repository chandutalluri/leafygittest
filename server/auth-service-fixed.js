const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8085;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'authentication', port: PORT });
});

// Root level endpoints for backward compatibility
app.post('/register', async (req, res) => {
  return registerHandler(req, res);
});

app.post('/login', async (req, res) => {
  return loginHandler(req, res);
});

// API level endpoints (preferred)
app.post('/api/auth/register', async (req, res) => {
  return registerHandler(req, res);
});

app.post('/api/auth/login', async (req, res) => {
  return loginHandler(req, res);
});

// Logout endpoint
app.post('/api/auth/logout', async (req, res) => {
  // JWT tokens are stateless, so logout is handled client-side
  res.json({ success: true, message: 'Logged out successfully' });
});

// Verify token endpoint
app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-256-bit-secret-key-here-change-in-production');
    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Customer register handler
async function registerHandler(req, res) {
  try {
    const { email, password, firstName, lastName, phone, branchId } = req.body;
    console.log('Customer registration attempt for:', email);

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create customer
    const result = await pool.query(`
      INSERT INTO users (email, password_hash, full_name, phone, role)
      VALUES ($1, $2, $3, $4, 'customer')
      RETURNING id, email, full_name, role
    `, [email, passwordHash, `${firstName} ${lastName}`, phone]);

    const user = result.rows[0];
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '24h' }
    );

    console.log('Registration successful for:', email);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Login handler function
async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    console.log('Customer login attempt for:', email);

    const result = await pool.query(`
      SELECT id, email, password_hash, 
             COALESCE(name, CONCAT(first_name, ' ', last_name)) as full_name, role
      FROM users 
      WHERE email = $1 AND role = 'customer'
    `, [email]);

    if (result.rows.length === 0) {
      console.log('Customer not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    console.log('Customer found:', user.email);

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      console.log('Invalid password for customer:', email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Get user's default branch (first active branch)
    const branchResult = await pool.query(`
      SELECT b.id, b.name, b.company_id 
      FROM branches b 
      WHERE b.is_active = true 
      ORDER BY b.id ASC 
      LIMIT 1
    `);
    const userBranchId = branchResult.rows.length > 0 ? branchResult.rows[0].id : 1;

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        branchId: userBranchId // Include branch context in JWT
      },
      process.env.JWT_SECRET || '818072bd26773dd1d2b0ecebebca84e4e8c1f71861bdc803e392656c42007013341eb51af9886d7945ebd7bfa98b53ecdec0a5095f4a753847d5158f71a37e9a',
      { expiresIn: '7d' }
    );

    console.log('Customer login successful:', email);
    
    res.json({ 
      success: true, 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Customer login error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
}

app.post('/api/auth/internal/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const result = await pool.query(`
      SELECT id, email, password_hash, 
             CONCAT(first_name, ' ', last_name) as full_name, role, branch_id
      FROM users 
      WHERE email = $1
    `, [email]);

    if (result.rows.length === 0) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('User found:', user.email, 'Role:', user.role);

    // Check password (handle plain text for demo)
    let passwordValid = false;
    if (user.password_hash) {
      // For demo/development, try plain text first
      if (password === user.password_hash) {
        passwordValid = true;
      } else {
        // Try bcrypt if plain text fails
        try {
          passwordValid = await bcrypt.compare(password, user.password_hash);
        } catch (bcryptError) {
          console.log('Bcrypt comparison failed:', bcryptError.message);
          passwordValid = false;
        }
      }
    }

    if (!passwordValid) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get current user endpoint (for auth checking)
app.get('/api/auth/user', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(404).json({ error: 'Not authenticated' });
  }

  const token = authHeader.substring(7);
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      id: decoded.userId,
      email: decoded.email,
      fullName: decoded.name || 'Customer',
      role: decoded.role
    });
  } catch (error) {
    res.status(404).json({ error: 'Invalid token' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        fullName: decoded.name || 'Customer',
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔐 Authentication Service running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});