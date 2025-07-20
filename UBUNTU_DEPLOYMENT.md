# Ubuntu VPS Deployment - LeafyHealth Platform

## Simple One-Command Solution

```bash
node quick-start.js
```

This command will:
1. Install dependencies with `--legacy-peer-deps` to fix conflicts
2. Start the unified gateway on port 5000
3. Make the application available immediately

## Manual Steps (if needed)

### Step 1: Fix Dependencies
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Step 2: Start Gateway Only
```bash
node server/unified-gateway-fixed.js
```

### Step 3: Access Application
- Main: http://your-server-ip:5000
- Super Admin: http://your-server-ip:5000/
- Customer: http://your-server-ip:5000/customer  
- Admin Portal: http://your-server-ip:5000/admin
- Operations: http://your-server-ip:5000/ops

## Ubuntu Server Setup

### Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Create Application Directory
```bash
sudo mkdir -p /opt/leafyhealth
sudo chown $USER:$USER /opt/leafyhealth
```

### Deploy Files
```bash
# Copy your files to the server
scp -r . user@your-server-ip:/opt/leafyhealth/
cd /opt/leafyhealth
```

### Start Application
```bash
node quick-start.js
```

## Systemd Service (Production)

Create `/etc/systemd/system/leafyhealth.service`:

```ini
[Unit]
Description=LeafyHealth Platform
After=network.target

[Service]
Type=simple
User=leafy
WorkingDirectory=/opt/leafyhealth
ExecStart=/usr/bin/node quick-start.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable leafyhealth
sudo systemctl start leafyhealth
sudo systemctl status leafyhealth
```

## Troubleshooting

### Port 5000 in use:
```bash
sudo lsof -ti:5000 | xargs kill -9
```

### Check what's running:
```bash
ps aux | grep node
```

### View logs (if using systemd):
```bash
journalctl -u leafyhealth -f
```

## Firewall Setup

```bash
sudo ufw allow 22/tcp
sudo ufw allow 5000/tcp
sudo ufw enable
```

---

**Ready**: Your LeafyHealth platform is now running on Ubuntu!