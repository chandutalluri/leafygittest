# GitHub Actions CI/CD Setup for LeafyHealth

## Overview

Your LeafyHealth platform now has automated CI/CD pipelines that will:
- Build all frontend applications 
- Test the unified gateway
- Deploy to your Ubuntu VPS automatically
- Set up systemd service for production

## Required GitHub Secrets

In your GitHub repository, go to Settings → Secrets and Variables → Actions, then add these secrets:

### VPS Connection Secrets
```
VPS_HOST=your-vps-ip-address
VPS_USERNAME=leafy
VPS_SSH_KEY=your-private-ssh-key-content
VPS_PORT=22
```

### How to Get SSH Key

On your local machine:
```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copy public key to VPS
ssh-copy-id leafy@your-vps-ip

# Copy private key content for GitHub secret
cat ~/.ssh/id_rsa
```

Copy the entire private key content (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) into the `VPS_SSH_KEY` secret.

## Workflows

### 1. Build and Test (build-only.yml)
- Triggers on Pull Requests
- Tests all frontend builds
- Validates TypeScript
- Tests gateway startup
- No deployment

### 2. Deploy to VPS (deploy.yml)
- Triggers on push to main/master branch
- Builds all applications in GitHub Actions
- Creates deployment package
- Deploys to VPS via SSH
- Sets up systemd service
- Runs health checks

## VPS Preparation

Your VPS needs these one-time setup steps:

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create user and directory
sudo useradd -m -s /bin/bash leafy
sudo mkdir -p /opt/leafyhealth
sudo chown leafy:leafy /opt/leafyhealth

# Set up firewall
sudo ufw allow 22/tcp
sudo ufw allow 5000/tcp
sudo ufw enable
```

## Deployment Process

1. **Push to main branch** - Triggers deployment
2. **GitHub Actions builds** all frontend apps
3. **Creates deployment package** with built assets
4. **Uploads to VPS** via SSH
5. **Sets up systemd service** for production
6. **Health checks** confirm deployment success

## Production Service

After deployment, your application runs as a systemd service:

```bash
# Check status
sudo systemctl status leafyhealth

# View logs
journalctl -u leafyhealth -f

# Restart service
sudo systemctl restart leafyhealth

# Stop service
sudo systemctl stop leafyhealth
```

## Application URLs

After successful deployment:
- **Main Application**: http://your-vps-ip:5000
- **Health Check**: http://your-vps-ip:5000/health
- **API Endpoints**: http://your-vps-ip:5000/api/*

## Benefits

✅ **Automated builds** in clean GitHub environment
✅ **Dependency conflict resolution** with `--legacy-peer-deps`
✅ **Zero-downtime deployment** with backup/rollback
✅ **Production systemd service** with auto-restart
✅ **Health monitoring** and validation
✅ **SSH-based secure deployment**

## Next Steps

1. Add the required GitHub secrets
2. Ensure VPS has Node.js 20 and user setup
3. Push to main branch to trigger first deployment
4. Monitor deployment logs in GitHub Actions tab

Your LeafyHealth platform will now build in GitHub's clean environment and deploy automatically to your Ubuntu VPS!