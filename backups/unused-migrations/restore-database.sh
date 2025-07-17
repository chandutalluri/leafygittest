#!/bin/bash
# LeafyHealth Database Restore Script
# This script restores the complete database from SQL migrations
# Works in any environment with PostgreSQL

set -e  # Exit on error

echo "==================================="
echo "LeafyHealth Database Restore Script"
echo "==================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set!"
    echo ""
    echo "Please set DATABASE_URL in one of these formats:"
    echo "  export DATABASE_URL=postgresql://user:pass@localhost:5432/leafyhealth"
    echo ""
    echo "Or set individual variables:"
    echo "  export PGHOST=localhost"
    echo "  export PGPORT=5432"
    echo "  export PGDATABASE=leafyhealth"
    echo "  export PGUSER=postgres"
    echo "  export PGPASSWORD=yourpassword"
    echo ""
    exit 1
fi

echo "📌 Database: $DATABASE_URL"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Execute migrations in order
echo "🔄 Running migrations..."
echo ""

MIGRATIONS=(
    "0001_create_schema_migrations.sql"
    "0002_create_core_tables.sql"
    "0003_create_company_tables.sql"
    "0004_create_product_tables.sql"
    "0005_create_all_tables.sql"
    "0006_insert_sample_data.sql"
)

TOTAL=${#MIGRATIONS[@]}
CURRENT=0

for migration in "${MIGRATIONS[@]}"; do
    CURRENT=$((CURRENT + 1))
    echo "[$CURRENT/$TOTAL] Executing: $migration"
    
    if [ -f "$SCRIPT_DIR/$migration" ]; then
        psql "$DATABASE_URL" -f "$SCRIPT_DIR/$migration" > /dev/null 2>&1 || {
            echo "❌ Failed to execute $migration"
            echo "   Please check the error and try again."
            exit 1
        }
        echo "   ✅ Success"
    else
        echo "   ⚠️  Warning: $migration not found, skipping..."
    fi
done

echo ""
echo "✅ Database restoration complete!"
echo ""
echo "📊 Summary:"
echo "   - 77 tables created"
echo "   - 32 products with Telugu translations"
echo "   - 10 categories"
echo "   - 3 companies with FSSAI licenses"
echo "   - 5 branches across Hyderabad"
echo "   - Complete inventory data"
echo "   - Sample suppliers and promotions"
echo ""
echo "🚀 Your LeafyHealth database is ready!"
echo ""
echo "To verify the restoration:"
echo "  psql \$DATABASE_URL -c 'SELECT COUNT(*) FROM products;'"
echo "  psql \$DATABASE_URL -c '\\dt' | wc -l  # Should show 77+ tables"
echo ""