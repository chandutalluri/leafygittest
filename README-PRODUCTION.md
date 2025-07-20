# LeafyHealth Platform - Production Deployment

## Single Command Deployment

### Build and Run Everything (One Command)
```bash
node build-and-run.js
```

This single command will:
1. Build all 5 frontend applications
2. Build all 29+ backend microservices  
3. Start the unified gateway on port 5000
4. Start all services and health monitoring

### Individual Commands

#### Build Only
```bash
node scripts/build-production.js
```

#### Start Only (after building)
```bash
node scripts/start-production.js
```

#### Stop All Services
```bash
node scripts/stop-production.js
```

#### Health Check
```bash
node scripts/health-check.js
```

## Ubuntu 22.04 VPS Setup

### 1. Prepare Server
```bash
# Run the automated setup script
./scripts/ubuntu-setup.sh
```

### 2. Deploy Application
```bash
# Copy files to /opt/leafyhealth
sudo mkdir -p /opt/leafyhealth
sudo chown $USER:$USER /opt/leafyhealth
cp -r . /opt/leafyhealth/
cd /opt/leafyhealth
```

### 3. Install Dependencies
```bash
npm install --production
```

### 4. Start Application
```bash
# Build and start everything
node build-and-run.js

# Or use individual commands
node scripts/build-production.js
node scripts/start-production.js
```

## Application Access

Once running, the application will be available at:

- **Main Application**: http://your-server-ip:5000
- **Customer Portal**: http://your-server-ip:5000/customer
- **Super Admin**: http://your-server-ip:5000/superadmin
- **Admin Portal**: http://your-server-ip:5000/admin
- **Operations**: http://your-server-ip:5000/ops
- **Health Check**: http://your-server-ip:5001/health

## Architecture

```
Ubuntu 22.04 VPS
├── Port 5000: Unified Gateway (External Access)
│   ├── Routes all frontend applications
│   ├── Routes all API requests
│   └── Serves static files
├── Port 5001: Health Monitoring
├── Ports 3000-3004: Frontend Applications (Internal)
├── Ports 3010-3050: Backend Microservices (Internal)
└── Ports 8081, 8085: Core Services (Internal)
```

## Production Features

✅ **Complete Build System**: Single command builds everything  
✅ **Process Management**: Automatic service startup and monitoring  
✅ **Health Monitoring**: Real-time health checks on port 5001  
✅ **Graceful Shutdown**: Proper process termination  
✅ **Error Handling**: Comprehensive error logging  
✅ **Ubuntu Integration**: Systemd service configuration  
✅ **Security**: Only port 5000 exposed externally  
✅ **Scalability**: Ready for PM2 clustering  

## Environment Variables

Create `.env.production` file:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/leafyhealth

# Add your production API keys
STRIPE_SECRET_KEY=sk_live_...
JWT_SECRET=your-secret-key
```

## Monitoring

### Check System Status
```bash
# Application health
curl http://localhost:5001/health

# Individual service status  
curl http://localhost:5000/health

# Process status
ps aux | grep node
```

### View Logs
```bash
# If using systemd
journalctl -u leafyhealth -f

# If running manually
tail -f logs/production.log
```

## Backup and Recovery

### Database Backup
```bash
pg_dump leafyhealth > backup_$(date +%Y%m%d).sql
```

### Application Backup
```bash
tar -czf leafyhealth_backup.tar.gz /opt/leafyhealth
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Stop conflicting services or change ports
2. **Database connection**: Verify PostgreSQL is running
3. **Permission errors**: Check file ownership in /opt/leafyhealth
4. **Build failures**: Clear node_modules and rebuild

### Quick Fixes
```bash
# Stop all processes
node scripts/stop-production.js

# Kill any remaining processes
sudo pkill -f "node.*leafyhealth"

# Restart everything
node build-and-run.js
```

## Security Considerations

- Only port 5000 is exposed externally
- All internal services run on localhost
- Database credentials should be secured
- Consider adding SSL certificate for HTTPS
- Regular security updates recommended

---

**Ready for Production**: Your LeafyHealth platform is now production-ready for Ubuntu 22.04 VPS deployment!