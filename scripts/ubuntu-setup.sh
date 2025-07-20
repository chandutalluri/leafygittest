#!/bin/bash

##
# Ubuntu 22.04 VPS Setup Script for LeafyHealth Platform
# Installs all required dependencies and configures the environment
##

set -e

echo "🚀 Setting up LeafyHealth Platform on Ubuntu 22.04..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install build essentials
echo "📦 Installing build tools..."
sudo apt install -y build-essential python3 python3-pip git curl

# Install PM2 globally for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create PostgreSQL database and user
echo "🗄️ Setting up database..."
sudo -u postgres psql << EOF
CREATE DATABASE leafyhealth;
CREATE USER leafyhealth WITH PASSWORD 'leafyhealth123';
GRANT ALL PRIVILEGES ON DATABASE leafyhealth TO leafyhealth;
ALTER USER leafyhealth CREATEDB;
\q
EOF

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/leafyhealth
sudo chown $USER:$USER /opt/leafyhealth

# Create systemd service file
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/leafyhealth.service > /dev/null << EOF
[Unit]
Description=LeafyHealth Platform
Documentation=https://github.com/leafyhealth/platform
After=network.target postgresql.service

[Service]
Environment=NODE_ENV=production
Environment=DATABASE_URL=postgresql://leafyhealth:leafyhealth123@localhost:5432/leafyhealth
Type=simple
User=$USER
WorkingDirectory=/opt/leafyhealth
ExecStart=/usr/bin/npm run start:production
ExecStop=/usr/bin/npm run stop:production
Restart=on-failure
RestartSec=10
KillMode=mixed
KillSignal=SIGTERM
TimeoutStopSec=60

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
sudo systemctl daemon-reload
sudo systemctl enable leafyhealth

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 5000/tcp
sudo ufw allow 5001/tcp
echo "y" | sudo ufw enable

# Set up log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/leafyhealth > /dev/null << EOF
/opt/leafyhealth/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF

# Create environment file template
echo "🔧 Creating environment template..."
cat > /opt/leafyhealth/.env.production << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://leafyhealth:leafyhealth123@localhost:5432/leafyhealth

# Add your production environment variables here
# STRIPE_SECRET_KEY=
# JWT_SECRET=your-jwt-secret-here
# REDIS_URL=redis://localhost:6379
EOF

echo "✅ Ubuntu setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your application files to /opt/leafyhealth"
echo "2. Install dependencies: cd /opt/leafyhealth && npm install"
echo "3. Build the application: npm run build:all"
echo "4. Start the service: sudo systemctl start leafyhealth"
echo "5. Check status: sudo systemctl status leafyhealth"
echo ""
echo "🌐 Your application will be available at: http://your-server-ip:5000"
echo "❤️ Health check will be at: http://your-server-ip:5001/health"