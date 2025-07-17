# LeafyHealth SQL Migrations

This directory contains pure SQL migrations for the complete LeafyHealth database architecture.

## Overview

- **77 tables** covering all business domains
- **32 products** with Telugu translations  
- **Sample data** for companies, branches, inventory, and more
- **Environment-agnostic** - works with any PostgreSQL 14+ database

## Quick Restore

### Option 1: Shell Script (Recommended)
```bash
cd migrations
./restore-database.sh
```

### Option 2: Using Migration Manager
```bash
node database/migration-manager.js migrate
```

### Option 3: Manual SQL Execution
```bash
psql $DATABASE_URL -f migrations/0001_create_schema_migrations.sql
psql $DATABASE_URL -f migrations/0002_create_core_tables.sql
psql $DATABASE_URL -f migrations/0003_create_company_tables.sql
psql $DATABASE_URL -f migrations/0004_create_product_tables.sql
psql $DATABASE_URL -f migrations/0005_create_all_tables.sql
psql $DATABASE_URL -f migrations/0006_insert_sample_data.sql
```

## Migration Files

1. **0001_create_schema_migrations.sql** - Migration tracking system
2. **0002_create_core_tables.sql** - Authentication and user tables
3. **0003_create_company_tables.sql** - Companies and branches
4. **0004_create_product_tables.sql** - Product catalog structure
5. **0005_create_all_tables.sql** - All remaining 60+ tables
6. **0006_insert_sample_data.sql** - Complete sample data

## Environment Setup

Set your database connection:
```bash
export DATABASE_URL=postgresql://user:pass@localhost:5432/leafyhealth
```

Or use individual variables:
```bash
export PGHOST=localhost
export PGPORT=5432
export PGDATABASE=leafyhealth
export PGUSER=postgres
export PGPASSWORD=yourpassword
```

## Verification

After restoration, verify:
```bash
# Check table count (should be 77+)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"

# Check products
psql $DATABASE_URL -c "SELECT COUNT(*) FROM products;"

# Check branches
psql $DATABASE_URL -c "SELECT name, city FROM branches;"
```

## For Replit Agent

When asked to restore the database, simply run:
```bash
cd migrations && ./restore-database.sh
```

This will create all 77 tables with complete sample data in any PostgreSQL environment.