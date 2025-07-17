# LeafyHealth Database Setup Guide

## Overview
This guide provides instructions for setting up the LeafyHealth database in any environment (local, cloud, Docker, Kubernetes, etc.). The database is designed to be environment-agnostic and works with any PostgreSQL 14+ installation.

## Database Requirements
- PostgreSQL 14 or higher
- 2GB+ RAM minimum (4GB+ recommended for production)
- 10GB+ disk space
- Network access for microservices

## Environment Variables

### Option 1: Using DATABASE_URL (Recommended)
Set a single connection string that works with any PostgreSQL provider:

```bash
# Format: postgresql://username:password@host:port/database?sslmode=require
DATABASE_URL=postgresql://user:pass@localhost:5432/leafyhealth

# Optional SSL control
DATABASE_SSL=true  # Set to 'false' to disable SSL
```

### Option 2: Individual Connection Parameters
Use separate environment variables for flexibility:

```bash
PGHOST=localhost
PGPORT=5432
PGDATABASE=leafyhealth
PGUSER=postgres
PGPASSWORD=yourpassword
DATABASE_SSL=false  # Set to 'true' for production
```

## Quick Setup

### 1. Create Database
```sql
CREATE DATABASE leafyhealth;
CREATE USER leafyhealth_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE leafyhealth TO leafyhealth_user;
```

### 2. Run Migrations
```bash
# Check migration status
node database/migration-manager.js status

# Run all pending migrations
node database/migration-manager.js migrate

# Rollback if needed
node database/migration-manager.js rollback 1
```

### 3. Seed Initial Data
```bash
node scripts/seed-database.js
```

## Production Setup

### Connection Pooling
The system automatically configures connection pools based on environment:
- Development: 1-10 connections per service
- Production: 2-25 connections per service
- Each microservice has optimized pool settings

### SSL Configuration
Production environments automatically enable SSL unless explicitly disabled:
```bash
DATABASE_SSL=false  # Only set this for local development
```

### Supported Cloud Providers
The database configuration works with:
- AWS RDS PostgreSQL
- Google Cloud SQL
- Azure Database for PostgreSQL
- Heroku Postgres
- Digital Ocean Managed Databases
- Neon Database
- Supabase
- Railway
- Any PostgreSQL-compatible service

### Docker Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: leafyhealth
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Kubernetes Setup
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-config
data:
  POSTGRES_DB: leafyhealth
  POSTGRES_USER: postgres
---
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
type: Opaque
data:
  POSTGRES_PASSWORD: <base64-encoded-password>
```

## Migration System

### Creating New Migrations
1. Create a new SQL file in `migrations/` folder
2. Name format: `NNNN_description.sql` (e.g., `0002_add_user_preferences.sql`)
3. Include both UP and DOWN migrations

Example migration:
```sql
-- Migration: Add user preferences
-- UP
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) REFERENCES users(id),
  theme VARCHAR(50) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For rollback, create a corresponding rollback file:
-- rollback_0002_add_user_preferences.sql
-- DROP TABLE user_preferences;
```

### Migration Commands
```bash
# Check current status
node database/migration-manager.js status

# Run all pending migrations
node database/migration-manager.js migrate

# Rollback last migration
node database/migration-manager.js rollback

# Rollback multiple migrations
node database/migration-manager.js rollback 3

# Reset database (WARNING: Drops all data)
node database/migration-manager.js reset
```

## Database Schema

### Core Tables (77 tables)
1. **Authentication**: sessions, users, user_sessions, roles, user_roles
2. **Company Management**: companies, branches
3. **Product Catalog**: categories, products, product_variants, product_images
4. **Inventory**: inventory, inventory_transactions, suppliers, purchase_orders
5. **Customers**: customers, customer_addresses, wishlists
6. **Orders**: carts, cart_items, orders, order_items, order_status_history
7. **Payments**: payments, payment_methods, refunds
8. **Financial**: expenses, cash_registers, accounting_entries
9. **Shipping**: shipping_methods, delivery_routes, deliveries
10. **Marketing**: promotions, promotion_usage, loyalty_programs, loyalty_transactions
11. **Reviews**: reviews, review_responses
12. **HR**: employees, employee_attendance, employee_leaves
13. **Vendors**: vendors, vendor_transactions
14. **Notifications**: notifications, email_logs, sms_logs, push_notification_logs
15. **Analytics**: analytics_events, daily_statistics, product_statistics
16. **System**: api_performance_logs, database_performance_logs, system_settings, audit_logs
17. **Subscriptions**: subscription_plans, customer_subscriptions, subscription_deliveries
18. **Content**: pages, banners, faqs
19. **Integration**: webhooks, webhook_logs, api_integrations, integration_logs
20. **Label Design**: label_templates, custom_template_dimensions, print_jobs
21. **Marketplace**: marketplaces, marketplace_listings
22. **Localization**: languages, translations
23. **Compliance**: compliance_rules, compliance_checks
24. **Media**: image_metadata, image_transformations

## Performance Optimization

### Indexes
All tables have appropriate indexes for:
- Primary keys
- Foreign keys
- Frequently queried fields
- Search fields (using pg_trgm for text search)

### Connection Management
- Use connection pooling (built-in)
- Close idle connections automatically
- Retry failed connections with exponential backoff

### Query Optimization
- Use prepared statements
- Implement query result caching
- Monitor slow queries (logged automatically)

## Monitoring

### Health Checks
Each microservice exposes database health endpoint:
```bash
curl http://localhost:PORT/health
```

### Performance Metrics
Monitor via Database Backup Service:
```bash
curl http://localhost:3041/api/backup/metrics
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check PostgreSQL is running
   - Verify connection parameters
   - Check firewall/security groups

2. **SSL Connection Failed**
   - Set `DATABASE_SSL=false` for local development
   - Ensure SSL certificates are valid for production

3. **Too Many Connections**
   - Reduce pool sizes in database/config.js
   - Check for connection leaks
   - Scale PostgreSQL instance

4. **Migration Failed**
   - Check SQL syntax
   - Verify foreign key constraints
   - Review migration logs

### Debug Mode
Enable detailed logging:
```bash
DEBUG=db:* node your-service.js
```

## Backup & Recovery

### Automated Backups
```bash
# Run backup
node scripts/quick-backup.js

# Restore from backup
node scripts/restore-from-backup.js backups/2025-06-27T13-14-55-104Z_backup.json
```

### Manual Backup
```bash
# Full database dump
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Security Best Practices

1. **Use Strong Passwords**: Minimum 16 characters
2. **Enable SSL**: Always use SSL in production
3. **Restrict Access**: Use firewall rules and VPC
4. **Regular Updates**: Keep PostgreSQL updated
5. **Audit Logging**: Enable audit logs for compliance
6. **Encryption**: Use encryption at rest when available
7. **Least Privilege**: Grant minimum required permissions

## Support

For database-related issues:
1. Check logs in each microservice
2. Review migration history
3. Verify connection settings
4. Monitor performance metrics