# LeafyHealth Scripts Directory

This directory contains essential scripts for managing the LeafyHealth platform. All duplicate and test scripts have been removed.

## Essential Scripts

### 1. `start-all-microservices.js` ⭐ (MAIN WORKFLOW SCRIPT)
- **Purpose**: Starts all 29 microservices with proper localhost binding
- **Used by**: "All Microservices" workflow
- **Features**: Sequential startup, health checks, automatic restarts

### 2. `build-all-microservices.js`
- **Purpose**: Builds all NestJS microservices (compiles TypeScript to JavaScript)
- **Usage**: Run before starting services if dist/main.js files are missing

### 3. `development-test-all.js`
- **Purpose**: Starts ALL services (29 microservices + 5 frontend apps) for comprehensive testing
- **Usage**: For full platform testing during development

### 4. `enforce-localhost-binding.js`
- **Purpose**: Ensures all services bind to 127.0.0.1 for security
- **Usage**: Security verification script

### 5. `production-safe-backup.js`
- **Purpose**: Creates database backups without affecting running services
- **Usage**: Safe backup operations that don't crash microservices

## Database Scripts

### 6. `create-all-tables.js`
- **Purpose**: Creates all 89 database tables from scratch
- **Usage**: Initial database setup

### 7. `create-traditional-tables.js`
- **Purpose**: Creates tables specifically for Traditional Orders feature
- **Usage**: Traditional supplies feature setup

### 8. `add-branch-support-to-tables.js`
- **Purpose**: Adds branch_id column to all business tables for multi-branch support
- **Usage**: Multi-branch feature migration

### 9. `add-remaining-tables.js`
- **Purpose**: Adds microservice-specific tables that were missing
- **Usage**: Complete database schema to 78+ tables

## Utility Scripts

### 10. `comprehensive-service-investigation.js`
- **Purpose**: Deep analysis and health check of all 29 microservices
- **Usage**: Debugging and service investigation

## Removed Scripts (13 duplicates/test scripts)
- fast-startup.js ❌
- optimized-startup.js ❌
- performance-optimized-startup.js ❌
- smart-microservices-startup.js ❌
- final-localhost-fix.js ❌
- fix-all-port-bindings.js ❌
- fix-all-service-bindings.js ❌
- fix-remaining-services.js ❌
- fix-nest-permissions.js ❌
- cleanup-redundant-scripts.js ❌
- cleanup-inactive-server-scripts.js ❌
- microservices-health-check.js ❌
- quick-fix-all-services.sh ❌

## Quick Commands

```bash
# Build all services
node scripts/build-all-microservices.js

# Start microservices only (current workflow)
node scripts/start-all-microservices.js

# Start EVERYTHING for testing
node scripts/development-test-all.js

# Enforce security
node scripts/enforce-localhost-binding.js

# Safe database backup
node scripts/production-safe-backup.js
```