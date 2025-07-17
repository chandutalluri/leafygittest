# ROOT DIRECTORY CLEANUP ANALYSIS

## FILES ANALYSIS

### ✅ ESSENTIAL FILES (KEEP)
**Configuration Files:**
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `drizzle.config.js` - Database ORM configuration
- `.eslintrc.js` - Code linting configuration
- `jest.config.js` - Testing configuration (if used)
- `jest.setup.js` - Jest test setup (if used)

**Status:** These are core project files required for proper functioning.

### 🗑️ MESSY FILES (REMOVE)
**Log Files:**
- `auth.log` (97 bytes) - Development log, not needed in production
- `gateway-manual.log` (2.8KB) - Manual gateway log with port mappings

**Database Dumps:**
- `leafy.dump` (247KB) - Database backup dump
- `leafydump.sql` (177KB) - SQL dump file
- `leafydump_cleaned.sql` (173KB) - Cleaned SQL dump
- `leafy.sql` (247KB) - Another SQL dump file

**Status:** These are temporary files consuming ~1MB of space.

### ❓ QUESTIONABLE FILES (ANALYZE)
**Performance Config:**
- `next.config.performance.js` - Performance optimization config

**Status:** Need to check if this is actually used by the application.

## CLEANUP PLAN

### Phase 1: Backup Messy Files
1. Create backup directory for removed files
2. Move all log files and database dumps to backup
3. Document what was removed and why

### Phase 2: Remove Redundant Files
1. Delete log files (already backed up in logs/ directory)
2. Remove database dumps (database is operational)
3. Clean up temporary files

### Phase 3: Analyze Configuration Files
1. Check if next.config.performance.js is referenced
2. Verify jest files are needed
3. Keep only essential configuration

### Phase 4: Document Cleanup
1. Update project documentation
2. Create cleanup report
3. Update .gitignore to prevent future mess

## EXPECTED OUTCOME
- ~1MB of space freed up
- Cleaner root directory
- Better project organization
- Clear documentation of decisions