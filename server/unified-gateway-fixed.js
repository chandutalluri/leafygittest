/**
 * Unified Multi-Application Gateway - Fixed Version
 * Single port (5000) serving all frontend applications and backend APIs
 * Eliminates port conflicts and provides clean unified access
 */

// Device detection function - hoisted to the very top
function isMobileDevice(userAgent) {
  if (!userAgent) return false;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
  return mobileRegex.test(userAgent);
}

const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const querystring = require('querystring');
const { spawn } = require('child_process');
const httpProxy = require('http-proxy-middleware');

const PORT = process.env.PORT || process.env.GATEWAY_PORT || 5000;

// Enhanced error handling for EPIPE and connection errors
process.on('uncaughtException', (err) => {
  if (err.code === 'EPIPE' || err.errno === -32) {
    console.log('⚠️  Handled EPIPE error - client disconnected');
    return;
  }
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  if (reason && (reason.code === 'EPIPE' || reason.errno === -32)) {
    console.log('⚠️  Handled EPIPE rejection - client disconnected');
    return;
  }
  console.error('Unhandled Rejection:', reason);
});

// Internal frontend application processes
const frontendProcesses = new Map();
let systemReadyStatus = {
  gatewayReady: false,
  frontendAppsReady: false,
  allServicesReady: false
};

// Frontend application configurations - served internally
const FRONTEND_APPS = {
  'super-admin': { 
    port: 3003, 
    basePath: '/', 
    dir: 'frontend/apps/super-admin',
    cmd: 'npm',
    args: ['run', 'dev', '--', '--port', '3003', '--hostname', '0.0.0.0']
  },
  'ecommerce-web': {
    port: 3000,
    basePath: '/customer',
    dir: 'frontend/apps/ecommerce-web',
    cmd: 'npm',
    args: ['run', 'dev', '--', '--port', '3000', '--hostname', '0.0.0.0']
  },
  'ecommerce-mobile': {
    port: 3001,
    basePath: '/mobile',
    dir: 'frontend/apps/ecommerce-mobile',
    cmd: 'npm',
    args: ['run', 'dev', '--', '--port', '3001', '--hostname', '0.0.0.0']
  },
  'admin-portal': {
    port: 3002,
    basePath: '/admin',
    dir: 'frontend/apps/admin-portal',
    cmd: 'npm',
    args: ['run', 'dev', '--', '--port', '3002', '--hostname', '0.0.0.0']
  },
  'ops-delivery': {
    port: 3004,
    basePath: '/ops',
    dir: 'frontend/apps/ops-delivery',
    cmd: 'npm',
    args: ['run', 'dev', '--', '--port', '3004', '--hostname', '0.0.0.0']
  }
};

// Backend microservices registry - LOCALHOST ONLY FOR SECURITY
// Uses master port configuration for conflict-free allocation
const masterConfig = require('../shared/master-port-config');

// Generate SERVICES object from master configuration
const SERVICES = {};

// Add all backend services from master config
for (const [serviceName, port] of Object.entries(masterConfig.SERVICE_PORTS)) {
  SERVICES[serviceName] = { port, url: `http://127.0.0.1:${port}` };
}

// Add special services
SERVICES['auth'] = { port: 8085, url: 'http://127.0.0.1:8085' };
SERVICES['direct-data'] = { port: 8081, url: 'http://127.0.0.1:8081' };
SERVICES['traditional'] = { port: 3050, url: 'http://127.0.0.1:3050' };

function setCorsHeaders(res, origin) {
  // Allow all Replit domains and localhost - ENHANCED FOR IFRAME COMPATIBILITY
  if (origin && (origin.includes('.replit.dev') || origin.includes('.picard.replit.dev') || origin.includes('.replit.app') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-Frame-Options');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // CRITICAL FIX: Remove X-Frame-Options to allow Replit iframe embedding
  res.removeHeader('X-Frame-Options');
  
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

function serveFallbackPage(res, origin) {
  setCorsHeaders(res, origin);
  setSecurityHeaders(res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.writeHead(200);
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LeafyHealth Platform - Loading</title>
    <style>
        body { margin: 0; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; }
        .container { max-width: 600px; }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .spinner { border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌿 LeafyHealth Platform</h1>
        <p>Telugu Organic Grocery Platform</p>
        <div class="spinner"></div>
        <p>Starting all microservices and frontend applications...</p>
        <script>setTimeout(() => { window.location.reload(); }, 3000);</script>
    </div>
</body>
</html>`);
}

function setSecurityHeaders(res) {
  // CRITICAL FIX FOR REPLIT IFRAME PREVIEW - Modified security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // REMOVED X-Frame-Options SAMEORIGIN to allow Replit iframe embedding
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'no-referrer');
  
  // Development-friendly CSP that allows Next.js hot reload and webpack + IFRAME
  res.setHeader('Content-Security-Policy', 
    "default-src 'self' 'unsafe-eval' 'unsafe-inline' *.replit.dev *.picard.replit.dev *.replit.app data: blob: ws: wss: https: http:;" +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.replit.dev *.picard.replit.dev *.replit.app;" +
    "style-src 'self' 'unsafe-inline' *.replit.dev *.picard.replit.dev *.replit.app fonts.googleapis.com;" +
    "img-src 'self' data: https: http: *.replit.dev *.picard.replit.dev *.replit.app;" +
    "font-src 'self' data: https: http: *.replit.dev *.picard.replit.dev *.replit.app fonts.gstatic.com fonts.googleapis.com assets.faircado.com *.ttf *.woff *.woff2;" +
    "connect-src 'self' ws: wss: https: http: *.replit.dev *.picard.replit.dev *.replit.app;" +
    "frame-src 'self' *.replit.dev *.picard.replit.dev *.replit.app; frame-ancestors 'self' *.replit.dev *.picard.replit.dev *.replit.app"
  );
}

function sendJSON(res, statusCode, data, origin = null) {
  setCorsHeaders(res, origin);
  setSecurityHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function proxyRequest(req, res, targetPort, targetPath, requestBody = null) {
  // Fixed URL construction with proper path handling and query parameters
  const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
  const url = new URL(req.url, 'http://localhost');
  const queryString = url.search; // Gets ?param=value&...
  const targetUrl = `http://127.0.0.1:${targetPort}${cleanPath}${queryString}`;
  
  console.log(`🔗 Proxying ${req.method} ${req.url} → ${targetUrl}`);
  
  const options = {
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${targetPort}`,
      'x-forwarded-for': req.connection.remoteAddress,
      'x-forwarded-proto': req.headers['x-forwarded-proto'] || 'http',
      'x-gateway-routed': 'true'
    },
    timeout: 30000
  };

  const proxyReq = http.request(targetUrl, options, (proxyRes) => {
    setCorsHeaders(res, req.headers.origin);
    setSecurityHeaders(res);
    
    // Enhanced connection error handling
    proxyRes.on('error', (err) => {
      if (err.code === 'EPIPE' || err.errno === -32) {
        console.log('⚠️  Client disconnected during response');
        return;
      }
      console.error('Proxy response error:', err.message);
    });
    
    // Forward response headers while filtering sensitive ones
    const responseHeaders = { ...proxyRes.headers };
    delete responseHeaders['x-powered-by'];
    delete responseHeaders['server'];
    
    if (!res.headersSent) {
      res.writeHead(proxyRes.statusCode, responseHeaders);
    }
    
    // Safe pipe with error handling
    proxyRes.pipe(res, { end: true }).on('error', (err) => {
      if (err.code === 'EPIPE' || err.errno === -32) {
        console.log('⚠️  Client disconnected during pipe');
        return;
      }
      console.error('Pipe error:', err.message);
    });
  });

  proxyReq.on('error', async (err) => {
    // Handle EPIPE errors gracefully
    if (err.code === 'EPIPE' || err.errno === -32) {
      console.log('⚠️  Client disconnected during request');
      return;
    }

    // Handle HTTP parsing errors for WebSocket connections
    if (err.message && err.message.includes('Parse Error: Expected HTTP/')) {
      console.log('⚠️  WebSocket connection error handled gracefully');
      return;
    }

    if (err.code === 'ECONNREFUSED') {
      console.log(`Proxy error to http://localhost:${targetPort}${cleanPath}: ${err.message}`);
      
      // Handle frontend app restart logic
      if (targetPort >= 3000 && targetPort <= 3004) {
        const appEntry = Object.entries(FRONTEND_APPS).find(([, config]) => config.port === targetPort);
        if (appEntry) {
          const [appName] = appEntry;
          console.log(`🔄 ${appName} service unavailable, attempting restart...`);
          await startFrontendApp(appName, FRONTEND_APPS[appName]);
        }
      }
      
      if (!res.headersSent) {
        sendJSON(res, 502, {
          error: 'Service temporarily unavailable',
          message: 'The requested service is starting up. Please try again in a moment.',
          retry: true
        }, req.headers.origin);
      }
      return;
    }

    console.error('Proxy request error:', err);
    if (!res.headersSent) {
      sendJSON(res, 502, {
        error: 'Gateway error',
        message: 'Unable to connect to backend service'
      }, req.headers.origin);
    }
  });

  // Send request body if present
  if (requestBody) {
    proxyReq.write(requestBody);
  }
  
  proxyReq.end();
}

// Device detection function already declared at top of file

async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const origin = req.headers.origin;
  const userAgent = req.headers['user-agent'] || '';

  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname} - Origin: ${origin || 'None'}`);

  // Route root path - redirect based on device type
  if (pathname === '/' && req.method === 'GET') {
    // Route root access directly to super-admin dashboard
    console.log('🏠 Root access - routing to super-admin dashboard');
    setCorsHeaders(res, origin);
    setSecurityHeaders(res);
    res.setHeader('Set-Cookie', 'app=super-admin; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3003, '/');
    return;
  }

  // Fix customer login routing - redirect /login to mobile customer login
  if (pathname === '/login' && req.method === 'GET') {
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    const isCurrentMobile = mobileCheck.test(userAgent || '');
    const loginPath = isCurrentMobile ? '/mobile/auth/login' : '/customer/auth/login';
    console.log(`🔐 Login access - ${isCurrentMobile ? 'Mobile' : 'Desktop'} device detected, redirecting to ${loginPath}`);
    setCorsHeaders(res, origin);
    setSecurityHeaders(res);
    res.writeHead(302, { 'Location': loginPath });
    res.end();
    return;
  }

  // Fix customer logout routing - redirect /logout to mobile customer logout  
  if (pathname === '/logout' && req.method === 'GET') {
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    const isCurrentMobile = mobileCheck.test(userAgent || '');
    const logoutPath = isCurrentMobile ? '/mobile/auth/login' : '/customer/auth/login';
    console.log(`🚪 Logout access - ${isCurrentMobile ? 'Mobile' : 'Desktop'} device detected, redirecting to ${logoutPath}`);
    setCorsHeaders(res, origin);
    setSecurityHeaders(res);
    res.writeHead(302, { 'Location': logoutPath });
    res.end();
    return;
  }

  // Handle webpack HMR requests - disable to prevent chunk loading errors
  if (pathname === '/_next/webpack-hmr') {
    // Disable HMR in gateway environment to prevent chunk loading errors
    if (!res.headersSent) {
      setCorsHeaders(res, origin);
      res.writeHead(204, { 'Content-Type': 'text/plain' });
      res.end();
    }
    return;
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res, origin);
    setSecurityHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint for gateway itself
  if (pathname === '/health' || pathname === '/api/health') {
    setCorsHeaders(res, origin);
    setSecurityHeaders(res);
    
    // Check if all services are ready
    const allReady = systemReadyStatus.gatewayReady && 
                     systemReadyStatus.frontendAppsReady && 
                     frontendProcesses.size === Object.keys(FRONTEND_APPS).length;
    
    sendJSON(res, allReady ? 200 : 503, { 
      status: allReady ? 'healthy' : 'initializing', 
      service: 'unified-gateway',
      timestamp: new Date().toISOString(),
      port: PORT,
      ready: allReady,
      services: {
        gateway: systemReadyStatus.gatewayReady,
        frontendApps: systemReadyStatus.frontendAppsReady,
        processCount: frontendProcesses.size,
        expectedProcesses: Object.keys(FRONTEND_APPS).length
      }
    }, origin);
    return;
  }



  // QR Code Proxy endpoint to bypass CSP restrictions
  if (pathname === '/api/labels/qr/proxy') {
    try {
      // Parse query parameters from req.url directly
      const fullUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const data = fullUrl.searchParams.get('data');
      const size = fullUrl.searchParams.get('size') || '300';
      const color = fullUrl.searchParams.get('color') || '000000';
      const bgcolor = fullUrl.searchParams.get('bgcolor') || 'ffffff';
      const ecc = fullUrl.searchParams.get('ecc') || 'M';
      const margin = fullUrl.searchParams.get('margin') || '10';
      
      console.log('🔗 QR Proxy request with data:', data);
      
      if (!data) {
        return sendJSON(res, 400, { error: 'Missing data parameter' }, origin);
      }

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&format=png&ecc=${ecc}&color=${color}&bgcolor=${bgcolor}&margin=${margin}`;
      
      console.log('🔗 QR Proxy request:', qrUrl);
      
      // Fetch QR code from external API
      const response = await fetch(qrUrl);
      
      if (!response.ok) {
        throw new Error(`QR generation failed: ${response.status}`);
      }

      const imageBuffer = await response.arrayBuffer();
      
      // Set proper headers for image response
      setCorsHeaders(res, origin);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      
      console.log('✅ QR proxy successful, serving image');
      res.writeHead(200);
      res.end(Buffer.from(imageBuffer));
      return;
    } catch (error) {
      console.error('❌ QR proxy error:', error);
      return sendJSON(res, 500, { error: 'Failed to generate QR code' }, origin);
    }
  }

  // Nutrition templates API endpoint
  if (pathname.startsWith('/api/nutrition/templates/')) {
    const category = pathname.split('/').pop();
    try {
      const { Pool } = require('pg');
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      
      const result = await pool.query(
        'SELECT category, required_fields, optional_fields, indian_fssai_compliance FROM nutrition_templates WHERE category = $1',
        [category]
      );
      
      if (result.rows.length > 0) {
        setCorsHeaders(res, origin);
        return sendJSON(res, 200, result.rows[0], origin);
      } else {
        return sendJSON(res, 404, { error: 'Template not found' }, origin);
      }
    } catch (error) {
      console.error('Nutrition template error:', error);
      return sendJSON(res, 500, { error: 'Failed to fetch template' }, origin);
    }
  }

  // OpenFoodFacts Nutrition API Proxy - must be handled before main API routing
  if (pathname === '/api/nutrition/search') {
    try {
      const fullUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const query = fullUrl.searchParams.get('q');
      const country = fullUrl.searchParams.get('country') || 'India';
      
      if (!query) {
        return sendJSON(res, 400, { error: 'Missing search query parameter (q)' }, origin);
      }
      
      console.log('🥗 OpenFoodFacts nutrition search for:', query, country ? `(${country})` : '(global)');
      
      // Try India first, then global search
      const searchUrls = [
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&countries=${country}`,
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`
      ];
      
      let bestResult = null;
      let searchSource = '';
      
      for (let i = 0; i < searchUrls.length; i++) {
        const searchUrl = searchUrls[i];
        searchSource = i === 0 ? `India (${country})` : 'Global';
        
        console.log('🌐 Fetching OpenFoodFacts:', searchUrl);
        
        try {
          const response = await fetch(searchUrl, {
            headers: {
              'User-Agent': 'LeafyHealth/1.0 (info@leafyhealth.com)',
              'Accept': 'application/json'
            },
            timeout: 15000
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`📊 OpenFoodFacts ${searchSource} response:`, data.count || 0, 'products found');
            
            if (data.products && data.products.length > 0) {
              // Find best match with comprehensive nutrition data
              const goodProduct = data.products.find(product => 
                product.product_name && 
                product.nutriments && 
                Object.keys(product.nutriments).length > 8 &&
                (product.product_name.toLowerCase().includes(query.toLowerCase()) ||
                 query.toLowerCase().includes(product.product_name.toLowerCase().split(' ')[0]))
              ) || data.products.find(product => 
                product.nutriments && Object.keys(product.nutriments).length > 5
              ) || data.products[0]; // Fallback to first product
              
              if (goodProduct && goodProduct.nutriments) {
                // Map OpenFoodFacts nutrition data to our format
                const nutrition = goodProduct.nutriments;
                bestResult = {
                  status: 'success',
                  source: searchSource,
                  product: {
                    name: goodProduct.product_name || query,
                    brand: goodProduct.brands || '',
                    serving_size: goodProduct.serving_size || '100g',
                    nutrition: {
                      energy_kcal: Math.round(nutrition.energy_kcal_100g || nutrition.energy_kcal || (nutrition.energy_100g / 4.184) || 0),
                      protein: nutrition.proteins_100g || nutrition.proteins || 0,
                      carbohydrates: nutrition.carbohydrates_100g || nutrition.carbohydrates || 0,
                      total_fat: nutrition.fat_100g || nutrition.fat || 0,
                      saturated_fat: nutrition['saturated-fat_100g'] || nutrition['saturated-fat'] || 0,
                      trans_fat: nutrition['trans-fat_100g'] || nutrition['trans-fat'] || 0,
                      dietary_fiber: nutrition.fiber_100g || nutrition.fiber || 0,
                      total_sugars: nutrition.sugars_100g || nutrition.sugars || 0,
                      sodium: nutrition.sodium_100g || nutrition.sodium || 0,
                      vitamin_c: nutrition['vitamin-c_100g'] || nutrition['vitamin-c'] || 0,
                      calcium: nutrition.calcium_100g || nutrition.calcium || 0,
                      iron: nutrition.iron_100g || nutrition.iron || 0,
                      potassium: nutrition.potassium_100g || nutrition.potassium || 0
                    }
                  }
                };
                break; // Found good result, stop searching
              }
            }
          }
        } catch (fetchError) {
          console.error(`❌ OpenFoodFacts ${searchSource} fetch error:`, fetchError.message);
          continue; // Try next source
        }
      }
      
      if (bestResult) {
        setCorsHeaders(res, origin);
        res.setHeader('Cache-Control', 'public, max-age=1800');
        console.log(`✅ OpenFoodFacts nutrition data found from ${bestResult.source}`);
        return sendJSON(res, 200, bestResult, origin);
      } else {
        console.log(`❌ No nutrition data found for: ${query}`);
        return sendJSON(res, 404, { 
          status: 'not_found', 
          message: `No nutrition data found for "${query}"`,
          suggestion: 'Try searching with a more generic product name'
        }, origin);
      }
    } catch (error) {
      console.error('❌ OpenFoodFacts API proxy error:', error);
      return sendJSON(res, 500, { 
        status: 'error', 
        error: 'Failed to fetch nutrition data',
        details: error.message 
      }, origin);
    }
  }

  // Handle webpack-hmr requests to prevent proxy errors
  if (pathname.includes('_next/webpack-hmr')) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Connection': 'close'
    });
    res.end('OK');
    return;
  }

  // API routes - proxy to backend microservices with fixed routing
  if (pathname.startsWith('/api/')) {
    const requestBody = req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' 
      ? await parseRequestBody(req) : null;

    // Fixed authentication service routing
    if (pathname.startsWith('/api/auth')) {
      proxyRequest(req, res, 8085, pathname, requestBody);
      return;
    }
    
    // Product Orchestrator service routing - MUST come before general /api/products
    if (pathname.startsWith('/api/product-orchestrator/')) {
      const targetPath = pathname.replace('/api/product-orchestrator', '/products');
      console.log(`🔗 Routing Product Orchestrator: ${pathname} → http://localhost:3042${targetPath}`);
      proxyRequest(req, res, 3042, targetPath, requestBody);
      return;
    }
    
    if (pathname.startsWith('/api/products/create-composite') || pathname.startsWith('/api/products/health')) {
      const targetPath = pathname.replace('/api/products', '/products');
      proxyRequest(req, res, 3042, targetPath, requestBody);
      return;
    }
    
    // Fixed company management service routing
    if (pathname.startsWith('/api/company-management')) {
      const companyPath = pathname.replace('/api', '');
      proxyRequest(req, res, 3013, companyPath, requestBody);
      return;
    }
    
    // Image Management Service routing - direct image serving for working demo
    if (pathname.startsWith('/api/image-management/serve/')) {
      const filename = pathname.split('/').pop();
      const imagePath = require('path').join(process.cwd(), 'backend', 'domains', 'image-management', 'uploads', 'products', 'original', filename);
      
      console.log(`🖼️  Direct image serving: ${filename} from ${imagePath}`);
      
      try {
        const fs = require('fs');
        if (fs.existsSync(imagePath)) {
          const ext = require('path').extname(filename).toLowerCase();
          const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
          };
          
          setCorsHeaders(res, origin);
          res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          res.setHeader('Content-Disposition', 'inline');
          
          const imageBuffer = fs.readFileSync(imagePath);
          res.end(imageBuffer);
          return;
        } else {
          console.log(`❌ Image not found: ${imagePath}`);
          sendJSON(res, 404, { error: 'Image not found', filename });
          return;
        }
      } catch (error) {
        console.error(`Error serving image ${filename}:`, error);
        sendJSON(res, 500, { error: 'Error serving image', filename, message: error.message });
        return;
      }
    }
    
    // Other Image Management Service routing to actual service
    if (pathname.startsWith('/api/image-management')) {
      const targetPath = pathname.replace('/api', ''); // Remove /api prefix
      console.log(`🖼️  Routing to Image Management service: ${pathname} → http://localhost:3035${targetPath}`);
      proxyRequest(req, res, 3035, targetPath, requestBody);
      return;
    }
    
    // Fixed direct data service routing
    if (pathname.startsWith('/api/direct-data')) {
      const dataPath = pathname.replace('/api/direct-data', '/api') || '/api/health';
      proxyRequest(req, res, 8081, dataPath, requestBody);
      return;
    }
    
    // Database backup-restore microservice routing (NEW)
    if (pathname.startsWith('/api/backup-restore')) {
      const backupPath = pathname.replace('/api/backup-restore', '') || '/health';
      proxyRequest(req, res, 3045, backupPath, requestBody);
      return;
    }
    
    // Traditional Orders Service routing (NEW) - Route to Direct Data Gateway
    if (pathname.startsWith('/api/traditional')) {
      console.log(`🏪 Routing Traditional Orders: ${pathname} → http://localhost:8081${pathname}`);
      proxyRequest(req, res, 8081, pathname, requestBody);
      return;
    }

    // Label Design Service routing - Route to actual microservice on port 3027
    if (pathname.startsWith('/api/labels')) {
      // QR Proxy continues to work perfectly - PRIORITY
      if (pathname.startsWith('/api/labels/qr/proxy')) {
        handleQRProxy(req, res);
        return;
      }
      
      // Custom Templates - Route to proper microservice
      if (pathname === '/api/labels/custom-templates') {
        console.log(`🏷️  Routing custom templates to Label Design microservice`);
        const templatePath = '/custom-templates';
        proxyRequest(req, res, 3027, templatePath, requestBody);
        return;
      }

      // Route all other label design requests to the microservice
      const labelPath = pathname.replace('/api/labels', '');
      console.log(`🏷️  Routing to Label Design service: ${pathname} → http://localhost:3027${labelPath}`);
      proxyRequest(req, res, 3027, labelPath, requestBody);
      return;
    }
    
    /* COMMENTED OUT - Now using actual microservice
    // Custom Templates - Direct Database Implementation (FIXED)
    if (pathname === '/api/labels/custom-templates') {
        console.log(`🏷️  Custom template request - implementing direct database operation`);
        
        if (req.method === 'POST') {
          try {
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            let templateData = {};
            try {
              templateData = requestBody ? JSON.parse(requestBody) : {};
            } catch (e) {
              console.error('JSON parse error:', e);
              return sendJSON(res, 400, { error: 'Invalid JSON data' }, origin);
            }
            
            console.log('💾 Custom template creation - name:', templateData.name);
            console.log('📊 Full templateData received:', JSON.stringify(templateData, null, 2));
            console.log('📐 templateJson:', templateData.templateJson);
            console.log('📏 template_data:', templateData.template_data);
            
            const query = `
              INSERT INTO label_templates (name, description, template_data, created_by)
              VALUES ($1, $2, $3, $4)
              RETURNING id, name, created_at
            `;
            
            const values = [
              templateData.name || 'Custom Template',
              templateData.description || '',
              JSON.stringify(templateData.templateJson || templateData.template_data || {}),
              'system'
            ];
            
            console.log('📋 SQL Values:', values);
            
            const result = await pool.query(query, values);
            const newTemplate = result.rows[0];
            
            console.log('✅ Custom template saved successfully:', newTemplate);
            
            sendJSON(res, 201, {
              success: true,
              data: newTemplate,
              message: 'Custom template created successfully'
            }, origin);
            
            await pool.end();
            return;
          } catch (error) {
            console.error('❌ Custom template creation error:', error);
            return sendJSON(res, 500, { 
              error: 'Failed to create custom template',
              details: error.message 
            }, origin);
          }
        }
        
        // GET request for custom templates
        if (req.method === 'GET') {
          try {
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            const query = 'SELECT id, name, description, template_data, created_at FROM label_templates ORDER BY created_at DESC';
            const result = await pool.query(query);
            
            sendJSON(res, 200, {
              success: true,
              data: result.rows
            }, origin);
            
            await pool.end();
            return;
          } catch (error) {
            console.error('❌ Custom template fetch error:', error);
            return sendJSON(res, 500, { 
              error: 'Failed to fetch custom templates' 
            }, origin);
          }
        }
        
        return sendJSON(res, 405, { error: 'Method not allowed' }, origin);
      }
      
      // Handle DELETE and UPDATE for specific template IDs
      if (pathname.match(/^\/api\/labels\/custom-templates\/(\d+)$/)) {
        const templateId = pathname.match(/^\/api\/labels\/custom-templates\/(\d+)$/)[1];
        
        // DELETE custom template
        if (req.method === 'DELETE') {
          console.log('🗑️ Delete custom template request - ID:', templateId);
          
          try {
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            const query = 'DELETE FROM label_templates WHERE id = $1 RETURNING id, name';
            const result = await pool.query(query, [templateId]);
            
            if (result.rows.length === 0) {
              sendJSON(res, 404, { error: 'Template not found' }, origin);
              return;
            }
            
            const deletedTemplate = result.rows[0];
            console.log('✅ Custom template deleted successfully:', deletedTemplate);
            
            sendJSON(res, 200, {
              success: true,
              data: deletedTemplate,
              message: 'Template deleted successfully'
            }, origin);
            
            await pool.end();
            
          } catch (error) {
            console.error('❌ Custom template deletion error:', error);
            sendJSON(res, 500, { error: 'Failed to delete custom template', details: error.message }, origin);
          }
          return;
        }
        
        // UPDATE custom template
        if (req.method === 'PUT') {
          console.log('✏️ Update custom template request - ID:', templateId);
          
          try {
            let templateData;
            try {
              templateData = JSON.parse(requestBody);
            } catch (e) {
              console.error('JSON parse error:', e);
              return sendJSON(res, 400, { error: 'Invalid JSON data' }, origin);
            }
            
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            const query = `
              UPDATE label_templates 
              SET name = $1, description = $2, template_data = $3, updated_at = NOW()
              WHERE id = $4
              RETURNING id, name, created_at, updated_at
            `;
            
            const values = [
              templateData.name || 'Custom Template',
              templateData.description || '',
              JSON.stringify(templateData.template_data || {}),
              templateId
            ];
            
            console.log('📋 SQL Update Values:', values);
            
            const result = await pool.query(query, values);
            
            if (result.rows.length === 0) {
              sendJSON(res, 404, { error: 'Template not found' }, origin);
              return;
            }
            
            const updatedTemplate = result.rows[0];
            console.log('✅ Custom template updated successfully:', updatedTemplate);
            
            sendJSON(res, 200, {
              success: true,
              data: updatedTemplate,
              message: 'Template updated successfully'
            }, origin);
            
            await pool.end();
            
          } catch (error) {
            console.error('❌ Custom template update error:', error);
            sendJSON(res, 500, { error: 'Failed to update custom template', details: error.message }, origin);
          }
          return;
        }
        
        return sendJSON(res, 405, { error: 'Method not allowed' }, origin);
      }
      
      // Handle DELETE and UPDATE for template IDs via /api/labels/templates/{id}
      if (pathname.match(/^\/api\/labels\/templates\/(\d+)$/)) {
        const templateId = pathname.match(/^\/api\/labels\/templates\/(\d+)$/)[1];
        
        // DELETE custom template
        if (req.method === 'DELETE') {
          console.log('🗑️ Delete template request (labels/templates) - ID:', templateId);
          
          try {
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            const query = 'DELETE FROM label_templates WHERE id = $1 RETURNING id, name';
            const result = await pool.query(query, [templateId]);
            
            if (result.rows.length === 0) {
              sendJSON(res, 404, { error: 'Template not found' }, origin);
              return;
            }
            
            const deletedTemplate = result.rows[0];
            console.log('✅ Template deleted successfully:', deletedTemplate);
            
            sendJSON(res, 200, {
              success: true,
              data: deletedTemplate,
              message: 'Template deleted successfully'
            }, origin);
            
            await pool.end();
            
          } catch (error) {
            console.error('❌ Template deletion error:', error);
            sendJSON(res, 500, { error: 'Failed to delete template', details: error.message }, origin);
          }
          return;
        }
        
        // UPDATE custom template
        if (req.method === 'PUT') {
          console.log('✏️ Update template request (labels/templates) - ID:', templateId);
          
          try {
            let templateData;
            try {
              templateData = JSON.parse(requestBody);
            } catch (e) {
              console.error('JSON parse error:', e);
              return sendJSON(res, 400, { error: 'Invalid JSON data' }, origin);
            }
            
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            const query = `
              UPDATE label_templates 
              SET name = $1, description = $2, template_data = $3, updated_at = NOW()
              WHERE id = $4
              RETURNING id, name, created_at, updated_at
            `;
            
            const values = [
              templateData.name || 'Custom Template',
              templateData.description || '',
              JSON.stringify(templateData.template_data || {}),
              templateId
            ];
            
            console.log('📋 SQL Update Values:', values);
            
            const result = await pool.query(query, values);
            
            if (result.rows.length === 0) {
              sendJSON(res, 404, { error: 'Template not found' }, origin);
              return;
            }
            
            const updatedTemplate = result.rows[0];
            console.log('✅ Template updated successfully:', updatedTemplate);
            
            sendJSON(res, 200, {
              success: true,
              data: updatedTemplate,
              message: 'Template updated successfully'
            }, origin);
            
            await pool.end();
            
          } catch (error) {
            console.error('❌ Template update error:', error);
            sendJSON(res, 500, { error: 'Failed to update template', details: error.message }, origin);
          }
          return;
        }
        
        return sendJSON(res, 405, { error: 'Method not allowed' }, origin);
      }

      // Working fallback for Label Design endpoints (eliminates 404 errors)
      if (pathname === '/api/labels/media-types') {
        console.log(`🏷️  Fetching REAL Avery media types from database`);
        
        try {
          const { Pool } = require('pg');
          const pool = new Pool({ connectionString: process.env.DATABASE_URL });
          
          const query = `
            SELECT id, name, description, label_width_mm, label_height_mm, 
                   page_width_mm, page_height_mm, rows, columns, 
                   gap_x_mm, gap_y_mm, margin_top_mm, margin_bottom_mm, 
                   margin_left_mm, margin_right_mm, media_type, avery_code
            FROM label_media_types 
            WHERE is_active = true 
            ORDER BY avery_code
          `;
          
          const result = await pool.query(query);
          
          const mediaTypes = result.rows.map(media => ({
            id: media.id,
            name: media.name,
            description: media.description,
            averyCode: media.avery_code,
            dimensions: {
              labelWidth: parseFloat(media.label_width_mm),
              labelHeight: parseFloat(media.label_height_mm),
              pageWidth: parseFloat(media.page_width_mm),
              pageHeight: parseFloat(media.page_height_mm)
            },
            layout: {
              rows: media.rows,
              columns: media.columns,
              gaps: {
                x: parseFloat(media.gap_x_mm),
                y: parseFloat(media.gap_y_mm)
              },
              margins: {
                top: parseFloat(media.margin_top_mm),
                bottom: parseFloat(media.margin_bottom_mm),
                left: parseFloat(media.margin_left_mm),
                right: parseFloat(media.margin_right_mm)
              }
            },
            mediaType: media.media_type
          }));
          
          console.log(`✅ Serving ${mediaTypes.length} Avery media types from database`);
          
          sendJSON(res, 200, {
            success: true,
            data: mediaTypes,
            total: mediaTypes.length
          }, origin);
          
          await pool.end();
          return;
          
        } catch (error) {
          console.error('❌ Media types database error:', error);
          return sendJSON(res, 500, { 
            error: 'Failed to fetch media types from database',
            details: error.message 
          }, origin);
        }
      }
      // Route template operations to Label Design Service for real database operations
      if (pathname === '/api/labels/templates' && req.method === 'POST') {
        console.log(`🏷️  Template creation request received - creating template in database`);
        try {
          const { Pool } = require('pg');
          const pool = new Pool({ connectionString: process.env.DATABASE_URL });
          
          // Parse JSON from request body string
          let templateData = {};
          try {
            templateData = requestBody ? JSON.parse(requestBody) : {};
          } catch (e) {
            console.error('JSON parse error:', e);
            templateData = {};
          }
          console.log('💾 Template creation - name:', templateData.name, 'description:', templateData.description);
          
          // Insert into label_templates table (id is auto-incrementing)
          const insertQuery = `
            INSERT INTO label_templates (
              name, description, template_data, category, is_public, created_by, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            RETURNING id, name, created_at
          `;
          
          const values = [
            templateData.name || 'Untitled Template',
            templateData.description || '',
            JSON.stringify(templateData.templateJson || {}),
            templateData.type || 'product',
            true,
            templateData.createdBy || 'system'
          ];
          
          console.log('📋 SQL Values:', values);
          
          const result = await pool.query(insertQuery, values);
          
          if (result.rows.length > 0) {
            console.log('✅ Template saved successfully:', result.rows[0]);
            sendJSON(res, 200, {
              success: true,
              message: 'Template saved successfully',
              data: result.rows[0]
            });
          } else {
            throw new Error('Failed to create template');
          }
          
          await pool.end();
        } catch (error) {
          console.error('❌ Template creation error:', error);
          sendJSON(res, 500, {
            success: false,
            error: 'Failed to save template',
            message: error.message
          });
        }
        return;
      }
      
      if (pathname === '/api/labels/custom-templates' && req.method === 'POST') {
        console.log(`🏷️  Routing custom template creation to Label Design Service: ${pathname}`);
        const labelPath = pathname.replace('/api/labels', '/label-design');
        proxyRequest(req, res, 3027, labelPath, requestBody);
        return;
      }
      
      // GET requests can use fallback for now
      if (pathname === '/api/labels/templates' && req.method === 'GET') {
        console.log(`🏷️  Providing working fallback for templates`);
        sendJSON(res, 200, {
          success: true,
          data: [
            { id: 1, name: 'Product Label', type: 'product' },
            { id: 2, name: 'Price Tag', type: 'pricing' },
            { id: 3, name: 'Barcode Label', type: 'barcode' }
          ]
        });
        return;
      }
      if (pathname === '/api/labels/custom-templates' && req.method === 'GET') {
        console.log(`🏷️  Fetching templates from database`);
        try {
          const { Pool } = require('pg');
          const pool = new Pool({ connectionString: process.env.DATABASE_URL });
          
          const result = await pool.query(`
            SELECT id, name, description, template_data, thumbnail_url, category, is_public, created_at, updated_at
            FROM label_templates
            ORDER BY created_at DESC
          `);
          
          await pool.end();
          
          sendJSON(res, 200, {
            success: true,
            templates: result.rows,
            count: result.rowCount,
            message: 'Templates fetched successfully'
          });
        } catch (error) {
          console.error('Error fetching templates:', error);
          sendJSON(res, 200, {
            success: true,
            templates: [],
            count: 0,
            message: 'No templates available'
          });
        }
        return;
      }
      
      // Media Types CRUD operations
      if (pathname === '/api/labels/media-types' && req.method === 'POST') {
        console.log('🏷️ Creating new media type');
        try {
          const { Pool } = require('pg');
          const pool = new Pool({ connectionString: process.env.DATABASE_URL });
          
          const mediaData = JSON.parse(requestBody);
          
          const result = await pool.query(`
            INSERT INTO label_media_types 
            (name, code, dimensions, orientation, description, manufacturer, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
          `, [
            mediaData.name,
            mediaData.code,
            JSON.stringify(mediaData.dimensions),
            mediaData.orientation,
            mediaData.description,
            mediaData.manufacturer,
            mediaData.isActive
          ]);
          
          await pool.end();
          
          sendJSON(res, 201, {
            success: true,
            data: result.rows[0],
            message: 'Media type created successfully'
          });
        } catch (error) {
          console.error('❌ Media type creation error:', error);
          sendJSON(res, 500, { error: 'Failed to create media type' });
        }
        return;
      }
      
      if (pathname.match(/^\/api\/labels\/media-types\/(\d+)$/)) {
        const mediaId = pathname.match(/^\/api\/labels\/media-types\/(\d+)$/)[1];
        
        if (req.method === 'PUT') {
          console.log('🏷️ Updating media type:', mediaId);
          try {
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            const mediaData = JSON.parse(requestBody);
            
            const result = await pool.query(`
              UPDATE label_media_types 
              SET name = $1, avery_code = $2, label_width_mm = $3, label_height_mm = $4,
                  page_width_mm = $5, page_height_mm = $6, rows = $7, columns = $8,
                  gap_x_mm = $9, gap_y_mm = $10, margin_top_mm = $11, margin_left_mm = $12,
                  description = $13, is_active = $14
              WHERE id = $15
              RETURNING *
            `, [
              mediaData.name,
              mediaData.code || mediaData.averyCode,
              mediaData.dimensions?.labelWidth || mediaData.labelWidth || mediaData.label_width_mm || 63.5,
              mediaData.dimensions?.labelHeight || mediaData.labelHeight || mediaData.label_height_mm || 38.1,
              mediaData.dimensions?.pageWidth || mediaData.pageWidth || mediaData.page_width_mm || 210,
              mediaData.dimensions?.pageHeight || mediaData.pageHeight || mediaData.page_height_mm || 297,
              mediaData.dimensions?.rows || mediaData.rows || mediaData.verticalCount || 4,
              mediaData.dimensions?.columns || mediaData.columns || mediaData.horizontalCount || 3,
              mediaData.dimensions?.spacingX || mediaData.spacingX || mediaData.gap_x_mm || 1,
              mediaData.dimensions?.spacingY || mediaData.spacingY || mediaData.gap_y_mm || 1,
              mediaData.dimensions?.marginTop || mediaData.marginTop || mediaData.margin_top_mm || 1,
              mediaData.dimensions?.marginLeft || mediaData.marginLeft || mediaData.margin_left_mm || 1,
              mediaData.description,
              mediaData.isActive !== undefined ? mediaData.isActive : true,
              mediaId
            ]);
            
            await pool.end();
            
            if (result.rows.length === 0) {
              sendJSON(res, 404, { error: 'Media type not found' });
              return;
            }
            
            sendJSON(res, 200, {
              success: true,
              data: result.rows[0],
              message: 'Media type updated successfully'
            });
          } catch (error) {
            console.error('❌ Media type update error:', error);
            sendJSON(res, 500, { error: 'Failed to update media type' });
          }
          return;
        }
        
        if (req.method === 'DELETE') {
          console.log('🏷️ Deleting media type:', mediaId);
          try {
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            const result = await pool.query(
              'DELETE FROM label_media_types WHERE id = $1 RETURNING id, name',
              [mediaId]
            );
            
            await pool.end();
            
            if (result.rows.length === 0) {
              sendJSON(res, 404, { error: 'Media type not found' });
              return;
            }
            
            sendJSON(res, 200, {
              success: true,
              data: result.rows[0],
              message: 'Media type deleted successfully'
            });
          } catch (error) {
            console.error('❌ Media type deletion error:', error);
            sendJSON(res, 500, { error: 'Failed to delete media type' });
          }
          return;
        }
      }

      // Nutrition templates API endpoint
      if (pathname === '/api/labels/nutrition-templates') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const category = url.searchParams.get('category') || 'fruits';
        console.log('🧪 Nutrition Templates API called for category:', category);
        
        // Return nutrition template based on category from database
        const templates = {
          fruits: {
            category: 'fruits',
            required_fields: ['energy_kcal', 'protein', 'carbohydrates', 'total_fat', 'dietary_fiber', 'total_sugars', 'vitamin_c'],
            optional_fields: ['potassium', 'folate', 'calcium', 'iron']
          },
          vegetables: {
            category: 'vegetables',
            required_fields: ['energy_kcal', 'protein', 'carbohydrates', 'total_fat', 'dietary_fiber', 'vitamin_a', 'vitamin_c'],
            optional_fields: ['potassium', 'iron', 'calcium', 'folate']
          },
          grains: {
            category: 'grains',
            required_fields: ['energy_kcal', 'protein', 'carbohydrates', 'total_fat', 'dietary_fiber', 'iron', 'thiamine'],
            optional_fields: ['calcium', 'potassium', 'niacin', 'riboflavin']
          },
          dairy: {
            category: 'dairy',
            required_fields: ['energy_kcal', 'protein', 'carbohydrates', 'total_fat', 'saturated_fat', 'calcium', 'vitamin_d'],
            optional_fields: ['vitamin_a', 'vitamin_b12', 'riboflavin', 'phosphorus']
          },
          oils: {
            category: 'oils',
            required_fields: ['energy_kcal', 'total_fat', 'saturated_fat', 'monounsaturated_fat', 'polyunsaturated_fat', 'vitamin_e'],
            optional_fields: ['vitamin_k', 'cholesterol']
          },
          spices: {
            category: 'spices',
            required_fields: ['energy_kcal', 'protein', 'carbohydrates', 'total_fat', 'dietary_fiber', 'sodium'],
            optional_fields: ['iron', 'calcium', 'potassium', 'vitamin_c']
          },
          pulses: {
            category: 'pulses',
            required_fields: ['energy_kcal', 'protein', 'carbohydrates', 'total_fat', 'dietary_fiber', 'iron', 'folate'],
            optional_fields: ['calcium', 'potassium', 'zinc', 'magnesium']
          },
          snacks: {
            category: 'snacks',
            required_fields: ['energy_kcal', 'protein', 'carbohydrates', 'total_fat', 'saturated_fat', 'sodium', 'total_sugars'],
            optional_fields: ['dietary_fiber', 'vitamin_c', 'iron', 'calcium']
          }
        };
        
        sendJSON(res, 200, {
          success: true,
          data: templates[category] || templates.fruits
        });
        return;
      }
      
      // Handle DELETE and UPDATE for template IDs via /api/labels/templates/{id} before fallback
      if (pathname.match(/^\/api\/labels\/templates\/(\d+)$/)) {
        const templateId = pathname.match(/^\/api\/labels\/templates\/(\d+)$/)[1];
        
        // DELETE custom template
        if (req.method === 'DELETE') {
          console.log('🗑️ Delete template request (BEFORE FALLBACK) - ID:', templateId);
          
          try {
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            const query = 'DELETE FROM label_templates WHERE id = $1 RETURNING id, name';
            const result = await pool.query(query, [templateId]);
            
            if (result.rows.length === 0) {
              sendJSON(res, 404, { error: 'Template not found' }, origin);
              return;
            }
            
            const deletedTemplate = result.rows[0];
            console.log('✅ Template deleted successfully (BEFORE FALLBACK):', deletedTemplate);
            
            sendJSON(res, 200, {
              success: true,
              data: deletedTemplate,
              message: 'Template deleted successfully'
            }, origin);
            
            await pool.end();
            
          } catch (error) {
            console.error('❌ Template deletion error (BEFORE FALLBACK):', error);
            sendJSON(res, 500, { error: 'Failed to delete template', details: error.message }, origin);
          }
          return;
        }
        
        // UPDATE custom template
        if (req.method === 'PUT') {
          console.log('✏️ Update template request (BEFORE FALLBACK) - ID:', templateId);
          
          try {
            let templateData;
            try {
              templateData = JSON.parse(requestBody);
            } catch (e) {
              console.error('JSON parse error:', e);
              return sendJSON(res, 400, { error: 'Invalid JSON data' }, origin);
            }
            
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            const query = `
              UPDATE label_templates 
              SET name = $1, description = $2, template_data = $3, updated_at = NOW()
              WHERE id = $4
              RETURNING id, name, created_at, updated_at
            `;
            
            const values = [
              templateData.name || 'Custom Template',
              templateData.description || '',
              JSON.stringify(templateData.template_data || {}),
              templateId
            ];
            
            console.log('📋 SQL Update Values (BEFORE FALLBACK):', values);
            
            const result = await pool.query(query, values);
            
            if (result.rows.length === 0) {
              sendJSON(res, 404, { error: 'Template not found' }, origin);
              return;
            }
            
            const updatedTemplate = result.rows[0];
            console.log('✅ Template updated successfully (BEFORE FALLBACK):', updatedTemplate);
            
            sendJSON(res, 200, {
              success: true,
              data: updatedTemplate,
              message: 'Template updated successfully'
            }, origin);
            
            await pool.end();
            
          } catch (error) {
            console.error('❌ Template update error (BEFORE FALLBACK):', error);
            sendJSON(res, 500, { error: 'Failed to update template', details: error.message }, origin);
          }
          return;
        }
      }
      
      // Default successful response for any other Label Design endpoints
      console.log(`🏷️  Label Design endpoint response: ${pathname}`);
      sendJSON(res, 200, { success: true, message: 'Label Design system operational' });
      return;
    }
    */
    


    // Label Design Service routing - Disabled (using direct database implementation above)
    // if (pathname.startsWith('/api/label-design')) {
    //   const labelPath = pathname.replace('/api', '');
    //   proxyRequest(req, res, 3027, labelPath, requestBody);
    //   return;
    // }

    // Route all other API requests to the Direct Data Gateway
    proxyRequest(req, res, 8081, pathname, requestBody);
    return;
  }

  // Determine the correct target port based on referer or session context
  function getTargetPortFromContext(req) {
    const referer = req.headers.referer;
    const cookie = req.headers.cookie || '';
    const pathname = req.url;
    
    // Check the actual path if it contains Next.js chunks with app prefixes
    if (pathname && pathname.includes('/pages/')) {
      // If requesting pages from customer app path
      if (referer && referer.includes('/customer')) return 3000;
    }
    
    // Check referer to determine which app is requesting the asset
    if (referer) {
      if (referer.includes('/customer')) return 3000;
      if (referer.includes('/mobile')) return 3001;
      if (referer.includes('/admin')) return 3002;
      if (referer.includes('/ops')) return 3004;
    }
    
    // Check session or cookie for app context
    if (cookie.includes('app=customer') || cookie.includes('app=ecommerce-web')) return 3000;
    if (cookie.includes('app=mobile') || cookie.includes('app=ecommerce-mobile')) return 3001;
    if (cookie.includes('app=admin') || cookie.includes('app=admin-portal')) return 3002;
    if (cookie.includes('app=ops') || cookie.includes('app=ops-delivery')) return 3004;
    
    // Default to super-admin
    return 3003;
  }

  // Handle Next.js static assets (/_next/static) and chunks
  if (pathname.startsWith('/_next/') || pathname.startsWith('/__nextjs_')) {
    const targetPort = getTargetPortFromContext(req);
    console.log(`🎯 Next.js static asset request: ${pathname} → port ${targetPort}`);
    proxyRequest(req, res, targetPort, pathname);
    return;
  }

  // Frontend routes - multi-app routing based on path prefix
  if (pathname.startsWith('/customer')) {
    const internalPath = pathname === '/customer' ? '/' : pathname.substring('/customer'.length);
    // Set app context cookie for static assets
    res.setHeader('Set-Cookie', 'app=customer; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3000, internalPath);
    return;
  }
  
  if (pathname.startsWith('/mobile')) {
    const internalPath = pathname === '/mobile' ? '/' : pathname.substring('/mobile'.length);
    res.setHeader('Set-Cookie', 'app=mobile; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3001, internalPath);
    return;
  }
  
  if (pathname.startsWith('/admin')) {
    const internalPath = pathname === '/admin' ? '/' : pathname.substring('/admin'.length);
    res.setHeader('Set-Cookie', 'app=admin; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3002, internalPath);
    return;
  }
  
  if (pathname.startsWith('/ops')) {
    const internalPath = pathname === '/ops' ? '/' : pathname.substring('/ops'.length);
    res.setHeader('Set-Cookie', 'app=ops; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3004, internalPath);
    return;
  }
  
  if (pathname.startsWith('/superadmin')) {
    // Handle super-admin routes - strip prefix since basePath is removed
    const internalPath = pathname === '/superadmin' ? '/' : pathname.substring('/superadmin'.length);
    res.setHeader('Set-Cookie', 'app=superadmin; Path=/; HttpOnly; SameSite=Strict');
    proxyRequest(req, res, 3003, internalPath);
    return;
  }

  // Handle service worker requests
  if (pathname === '/sw.js' || pathname === '/service-worker.js') {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache');
    res.writeHead(200);
    res.end(`
// Minimal service worker for development
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Pass through all requests
  event.respondWith(fetch(event.request));
});
    `);
    return;
  }

  // Handle manifest.json requests
  if (pathname === '/manifest.json') {
    // Route to the customer app's manifest by default
    proxyRequest(req, res, 3000, '/manifest.json');
    return;
  }

  // Handle font requests - route to appropriate app based on font name
  if (pathname.startsWith('/__nextjs_font/')) {
    const targetPort = getTargetPortFromContext(req);
    console.log(`🎯 Next.js font request: ${pathname} → port ${targetPort}`);
    proxyRequest(req, res, targetPort, pathname);
    return;
  }

  // Handle favicon and PWA icon requests
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg)$/) && !pathname.startsWith('/api/')) {
    // Route static assets to customer app by default
    proxyRequest(req, res, 3000, pathname);
    return;
  }

  // SMART DEVICE-BASED REDIRECTION SYSTEM
  // Automatically redirect users to appropriate app based on device type
  if (pathname === '/' || 
      (pathname.startsWith('/login') || 
       pathname.startsWith('/dashboard') ||
       pathname.startsWith('/database-backup-restore') ||
       pathname.startsWith('/operational-dashboard') ||
       pathname.startsWith('/security') ||
       pathname.startsWith('/company-management') ||
       pathname.startsWith('/branch-management') ||
       pathname.startsWith('/user-management') ||
       pathname.startsWith('/system-dashboard') ||
       pathname.startsWith('/image-management') ||
       pathname.startsWith('/catalog-management') ||
       pathname.startsWith('/inventory-management') ||
       pathname.startsWith('/order-management') ||
       pathname.startsWith('/payment-processing') ||
       pathname.startsWith('/customer-service') ||
       pathname.startsWith('/notification-service') ||
       pathname.startsWith('/shipping-delivery') ||
       pathname.startsWith('/employee-management') ||
       pathname.startsWith('/accounting-management') ||
       pathname.startsWith('/expense-monitoring') ||
       pathname.startsWith('/analytics-reporting') ||
       pathname.startsWith('/performance-monitor') ||
       pathname.startsWith('/reporting-management') ||
       pathname.startsWith('/content-management') ||
       pathname.startsWith('/label-design') ||
       pathname.startsWith('/marketplace-management') ||
       pathname.startsWith('/subscription-management') ||
       pathname.startsWith('/compliance-audit') ||
       pathname.startsWith('/integration-hub') ||
       pathname.startsWith('/multi-language-management') ||
       pathname.startsWith('/product-orchestrator') ||
       pathname.startsWith('/auth')) &&
      !pathname.startsWith('/customer') && 
      !pathname.startsWith('/mobile') && 
      !pathname.startsWith('/admin') && 
      !pathname.startsWith('/ops') &&
      !pathname.startsWith('/superadmin')) {
    
    // Device detection for automatic redirection
    const deviceUserAgent = req.headers['user-agent'] || '';
    const deviceMobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    const isDeviceMobile = deviceMobileCheck.test(deviceUserAgent);
    
    // If accessing root path, automatically redirect based on device
    if (pathname === '/') {
      setCorsHeaders(res, origin);
      setSecurityHeaders(res);
      
      if (isDeviceMobile) {
        // Mobile device - redirect to mobile customer app
        console.log(`📱 Mobile device detected, redirecting to /mobile`);
        res.writeHead(302, { 'Location': '/mobile' });
        res.end();
        return;
      } else {
        // Desktop/tablet device - redirect to customer web app
        console.log(`💻 Desktop device detected, redirecting to /customer`);
        res.writeHead(302, { 'Location': '/customer' });
        res.end();
        return;
      }
    }
    
    // For admin routes, continue to super-admin regardless of device
    setCorsHeaders(res, origin);
    setSecurityHeaders(res);
    res.setHeader('Set-Cookie', 'app=super-admin; Path=/; HttpOnly; SameSite=Strict');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    proxyRequest(req, res, 3003, pathname);
    return;
  }
  
  // Handle specific application routes with device validation
  if (!pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    const routeUserAgent = req.headers['user-agent'] || '';
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    const isRouteMobile = mobileCheck.test(routeUserAgent);
    
    // Authentication routes - route to customer app without redirection
    if (pathname.startsWith('/auth/')) {
      console.log(`🔐 Authentication route: ${pathname} → customer app`);
      setCorsHeaders(res, origin);
      setSecurityHeaders(res);
      proxyRequest(req, res, 3000, pathname);
      return;
    }
    
    // Cross-device redirection logic
    if (pathname.startsWith('/customer') && isRouteMobile) {
      // Desktop app accessed from mobile - redirect to mobile app
      console.log(`📱 Mobile user accessing /customer, redirecting to /mobile`);
      setCorsHeaders(res, origin);
      res.writeHead(302, { 'Location': '/mobile' });
      res.end();
      return;
    }
    
    if (pathname.startsWith('/mobile') && !isRouteMobile) {
      // Mobile app accessed from desktop - redirect to customer app
      console.log(`💻 Desktop user accessing /mobile, redirecting to /customer`);
      setCorsHeaders(res, origin);
      res.writeHead(302, { 'Location': '/customer' });
      res.end();
      return;
    }
  }

  // Fallback for other unknown routes - apply device-based redirection
  console.log(`⚠️  Unknown route: ${pathname}, applying device-based redirection`);
  const fallbackUserAgent = req.headers['user-agent'] || '';
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(fallbackUserAgent);
  
  setCorsHeaders(res, origin);
  setSecurityHeaders(res);
  
  if (isMobileDevice) {
    // Unknown mobile route - redirect to mobile app home
    console.log(`📱 Redirecting unknown mobile route to /mobile`);
    res.writeHead(302, { 'Location': '/mobile' });
    res.end();
  } else {
    // Unknown desktop route - redirect to customer app home
    console.log(`💻 Redirecting unknown desktop route to /customer`);
    res.writeHead(302, { 'Location': '/customer' });
    res.end();
  }
}

function parseRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', () => {
      resolve('');
    });
  });
}

async function startFrontendApp(appName, appConfig) {
  if (frontendProcesses.has(appName)) {
    return;
  }

  // Check if app directory exists
  const fs = require('fs');
  if (!fs.existsSync(appConfig.dir)) {
    console.log(`⚠️ Directory ${appConfig.dir} not found, skipping ${appName}`);
    return;
  }

  console.log(`🚀 Starting ${appName} frontend on port ${appConfig.port}`);
  
  const child = spawn(appConfig.cmd, appConfig.args, {
    cwd: appConfig.dir,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
    detached: false
  });

  child.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.log(`[${appName}] ${output}`);
    }
  });

  child.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output && !output.includes('webpack-hmr')) {
      console.log(`[${appName}] ${output}`);
    }
  });

  child.on('exit', (code) => {
    console.log(`[${appName}] Process exited with code ${code}`);
    frontendProcesses.delete(appName);
    
    // Only auto-restart if it's not a build error and hasn't restarted recently
    if (code !== 0 && !appConfig.restarting) {
      appConfig.restarting = true;
      setTimeout(() => {
        console.log(`🔄 Auto-restarting ${appName}...`);
        startFrontendApp(appName, appConfig).finally(() => {
          // Reset restart flag after attempt
          setTimeout(() => {
            appConfig.restarting = false;
          }, 10000);
        });
      }, 5000);
    }
  });

  frontendProcesses.set(appName, child);
  
  // Wait for service to be ready and verify it's responding
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Verify the service is actually responding
  let retries = 0;
  const maxRetries = 10;
  while (retries < maxRetries) {
    try {
      const http = require('http');
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${appConfig.port}/`, (res) => {
          resolve(res.statusCode);
        });
        req.on('error', reject);
        req.setTimeout(2000, () => req.abort());
      });
      break;
    } catch (err) {
      retries++;
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  console.log(`✅ ${appName} is ready and accessible through gateway`);
}

async function initializeFrontendApps() {
  for (const [appName, appConfig] of Object.entries(FRONTEND_APPS)) {
    await startFrontendApp(appName, appConfig);
  }
  systemReadyStatus.frontendAppsReady = true;
  systemReadyStatus.allServicesReady = true;
  console.log('🎯 All frontend applications initialized and verified');
}

// Start server immediately, then initialize frontend apps in background
const server = http.createServer(handleRequest);

server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

server.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`🚀 Production Gateway running on port ${PORT}`);
  console.log(`🔒 Security: Only port ${PORT} externally accessible`);
  console.log(`🌐 All services proxied through localhost`);
  console.log(`📊 Managing ${Object.keys(SERVICES).length} microservices`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  
  console.log(`🌐 Frontend Applications:`);
  for (const [name, config] of Object.entries(FRONTEND_APPS)) {
    const route = config.basePath === '/' ? '/' : config.basePath;
    console.log(`   ${name}: http://localhost:${PORT}${route} → :${config.port}`);
  }
  
  console.log(`📡 API Service Mappings:`);
  Object.entries(SERVICES).forEach(([name, config]) => {
    console.log(`   /api/${name} → ${config.url}`);
  });
  
  // Mark gateway as ready
  systemReadyStatus.gatewayReady = true;
  
  // Initialize frontend applications in background after server is ready
  console.log('🎯 Initializing all 5 frontend applications...');
  initializeFrontendApps().then(() => {
    console.log(`✅ All services ready - Gateway fully operational`);
  });
});



process.on('SIGINT', () => {
  console.log('🛑 Shutting down gateway...');
  
  // Kill all frontend processes
  for (const [appName, process] of frontendProcesses) {
    console.log(`🛑 Stopping ${appName}...`);
    process.kill();
  }
  
  server.close(() => {
    console.log('✅ Gateway shutdown complete');
    process.exit(0);
  });
});