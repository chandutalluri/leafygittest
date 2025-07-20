# Quick Fix Guide - LeafyHealth Platform

## Issue 1: npm dependency conflict

Run this to fix the eslint peer dependency issue:

```bash
node scripts/fix-dependencies.js
```

**Or manually:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Issue 2: JavaScript process variable conflict (FIXED)

Fixed the variable naming conflict in build scripts.

## Quick Test Without Building

If you want to test the gateway without building everything:

```bash
node scripts/simple-start.js
```

This starts just the unified gateway on port 5000.

## Full Build and Run Process

After fixing dependencies:

```bash
# Fix dependencies first (only needed once)
node scripts/fix-dependencies.js

# Then build and run everything
node build-and-run.js
```

## Alternative Commands

### Individual steps:
```bash
# 1. Fix dependencies
node scripts/fix-dependencies.js

# 2. Build everything  
node scripts/build-production.js

# 3. Start production
node scripts/start-production.js
```

### Or just start the gateway:
```bash
node scripts/simple-start.js
```

## Troubleshooting

### If port 5000 is busy:
```bash
lsof -ti:5000 | xargs kill -9
```

### If build still fails:
```bash
# Install chalk dependency specifically
npm install chalk --legacy-peer-deps

# Then try again
node build-and-run.js
```

### Check what's running:
```bash
ps aux | grep node
```

---

**Quick Start:** `node scripts/fix-dependencies.js && node scripts/simple-start.js`