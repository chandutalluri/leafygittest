-- Migration: Create schema migrations tracking table
-- This table tracks all executed migrations for proper version control

CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  execution_time_ms INTEGER,
  checksum VARCHAR(64),
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_migrations_version ON schema_migrations(version);
CREATE INDEX IF NOT EXISTS idx_migrations_executed ON schema_migrations(executed_at);