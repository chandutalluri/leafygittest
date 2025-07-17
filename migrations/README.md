# LeafyHealth Migration System

## Current Approach: Drizzle ORM

This application uses **Drizzle ORM** for database schema management, not SQL migration files.

### How Database Changes Work

1. **Schema Definition**: All tables are defined in `shared/schema.ts`
2. **Database Sync**: Use `npx drizzle-kit push` to sync schema to database
3. **No Migration Files**: Direct schema-to-database synchronization

### Making Database Changes

```bash
# 1. Edit shared/schema.ts to modify tables
# 2. Push changes to database
npx drizzle-kit push

# Optional: Generate migration files for reference
npx drizzle-kit generate

# Open database studio
npx drizzle-kit studio
```

### Current Database Status

- **Tables**: 113 tables operational
- **Database**: Single Neon PostgreSQL instance
- **Schema**: Defined in `shared/schema.ts` using Drizzle ORM
- **Sync Method**: `drizzle-kit push` command

### Migration Files Removed

The SQL migration files were removed because:
- Application uses Drizzle ORM approach
- Direct schema-to-database sync is more efficient
- Eliminates migration file management complexity
- Prevents confusion between migration systems

### For Future Changes

Always use the Drizzle ORM workflow:
1. Modify `shared/schema.ts`
2. Run `npx drizzle-kit push`
3. Database automatically updated

This is the professional, modern approach for TypeScript applications.