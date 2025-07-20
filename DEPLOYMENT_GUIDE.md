# LeafyHealth Platform - Ubuntu 22.04 VPS Deployment Guide

## Quick Start Commands

After setting up your Ubuntu VPS, use these commands to build and run the entire application:

### Build Everything
```bash
node scripts/build-production.js
```

### Start Production Server
```bash
node scripts/start-production.js
```

### Stop Production Server
```bash
node scripts/stop-production.js
```

### Restart Production Server
```bash
node scripts/stop-production.js && sleep 3 && node scripts/start-production.js
```

## Ubuntu 22.04 VPS Setup

### 1. Initial Server Setup
```bash
# Download and run the setup script
curl -o setup.sh https://raw.githubusercontent.com/your-repo/leafyhealth/main/scripts/ubuntu-setup.sh
chmod +x setup.sh
./setup.sh
```

Or manually run the setup script from your project:
```bash
chmod +x scripts/ubuntu-setup.sh
./scripts/ubuntu-setup.sh
```

### 2. Deploy Application Files
```bash
# Copy your application to the server
scp -r . user@your-server-ip:/opt/leafyhealth/

# Or clone from repository
cd /opt/leafyhealth
git clone https://github.com/your-repo/leafyhealth.git .
```

### 3. Install Dependencies
```bash
cd /opt/leafyhealth
npm install --production
```

### 4. Build and Start
```bash
# Build everything for production
node scripts/build-production.js

# Start the application
node scripts/start-production.js
```

## Service Management

### Using Systemd (Recommended)
```bash
# Start the service
sudo systemctl start leafyhealth

# Stop the service
sudo systemctl stop leafyhealth

# Restart the service
sudo systemctl restart leafyhealth

# Check status
sudo systemctl status leafyhealth

# View logs
journalctl -u leafyhealth -f
```

### Manual Management
```bash
# Start in background
nohup node scripts/start-production.js > logs/production.log 2>&1 &

# Stop all processes
node scripts/stop-production.js
```

## Application URLs

- **Main Application**: http://your-server-ip:5000
- **Health Check**: http://your-server-ip:5001/health
- **Customer Portal**: http://your-server-ip:5000/customer
- **Super Admin**: http://your-server-ip:5000/superadmin
- **Admin Portal**: http://your-server-ip:5000/admin
- **Operations**: http://your-server-ip:5000/ops

## Environment Configuration

Create and configure your production environment file:

```bash
# Edit environment variables
nano /opt/leafyhealth/.env.production
```

Required environment variables:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://leafyhealth:leafyhealth123@localhost:5432/leafyhealth

# Optional: Add your API keys
STRIPE_SECRET_KEY=sk_live_...
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=sk-...
```

## Database Setup

The setup script automatically creates a PostgreSQL database, but you may need to run migrations:

```bash
cd /opt/leafyhealth
npm run db:push
```

## Firewall Configuration

The setup script configures UFW firewall to allow:
- SSH (port 22)
- Application (port 5000)
- Health check (port 5001)

## SSL/HTTPS Setup (Optional)

To add SSL certificate with Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot nginx

# Configure Nginx proxy
sudo nano /etc/nginx/sites-available/leafyhealth

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

## Monitoring and Logs

### Application Logs
```bash
# View production logs
tail -f /opt/leafyhealth/logs/production.log

# View systemd logs
journalctl -u leafyhealth -f

# Check process status
ps aux | grep node
```

### Health Monitoring
```bash
# Check application health
curl http://localhost:5001/health

# Check all services
curl http://localhost:5000/health
```

## Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   ```bash
   sudo lsof -ti:5000 | xargs kill -9
   ```

2. **Database connection failed**
   ```bash
   sudo systemctl restart postgresql
   sudo -u postgres psql -c "SELECT version();"
   ```

3. **Service won't start**
   ```bash
   # Check logs
   journalctl -u leafyhealth --no-pager

   # Check permissions
   sudo chown -R $USER:$USER /opt/leafyhealth
   ```

4. **Build failures**
   ```bash
   # Clear node modules and rebuild
   rm -rf node_modules
   npm install
   node scripts/build-production.js
   ```

### Performance Optimization

1. **Enable PM2 clustering**
   ```bash
   npm install -g pm2
   pm2 start scripts/start-production.js --name leafyhealth --instances max
   ```

2. **Set up Nginx reverse proxy**
   ```bash
   # Configure Nginx for static file serving and load balancing
   sudo nano /etc/nginx/sites-available/leafyhealth
   ```

## Backup and Recovery

### Database Backup
```bash
# Create backup
sudo -u postgres pg_dump leafyhealth > backup_$(date +%Y%m%d).sql

# Restore backup
sudo -u postgres psql leafyhealth < backup_20241215.sql
```

### Application Backup
```bash
# Backup entire application
tar -czf leafyhealth_backup_$(date +%Y%m%d).tar.gz /opt/leafyhealth
```

## Updates and Maintenance

### Update Application
```bash
cd /opt/leafyhealth
git pull origin main
npm install --production
node scripts/build-production.js
sudo systemctl restart leafyhealth
```

### Security Updates
```bash
sudo apt update && sudo apt upgrade -y
sudo systemctl restart leafyhealth
```

## Production Checklist

- [ ] Ubuntu 22.04 server setup complete
- [ ] Node.js 20+ installed
- [ ] PostgreSQL installed and configured
- [ ] Application files deployed
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Firewall configured
- [ ] SSL certificate installed (optional)
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Application accessible on port 5000

## Support

For issues or questions:
1. Check the logs: `journalctl -u leafyhealth -f`
2. Verify health status: `curl http://localhost:5001/health`
3. Review this deployment guide
4. Check the application documentation in the repository

---

**Application Ready**: Your LeafyHealth platform should now be running on http://your-server-ip:5000