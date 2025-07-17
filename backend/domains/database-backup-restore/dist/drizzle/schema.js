"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupSchedules = exports.restoreJobs = exports.backupJobs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.backupJobs = (0, pg_core_1.pgTable)('backup_jobs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    jobId: (0, pg_core_1.varchar)('job_id', { length: 100 }).unique().notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).notNull().default('pending'),
    fileName: (0, pg_core_1.varchar)('file_name', { length: 255 }),
    gcsPath: (0, pg_core_1.varchar)('gcs_path', { length: 500 }),
    fileSize: (0, pg_core_1.varchar)('file_size', { length: 50 }),
    checksum: (0, pg_core_1.varchar)('checksum', { length: 64 }),
    startedAt: (0, pg_core_1.timestamp)('started_at').defaultNow(),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
    error: (0, pg_core_1.text)('error'),
    metadata: (0, pg_core_1.json)('metadata'),
    createdBy: (0, pg_core_1.varchar)('created_by', { length: 100 }).notNull(),
});
exports.restoreJobs = (0, pg_core_1.pgTable)('restore_jobs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    jobId: (0, pg_core_1.varchar)('job_id', { length: 100 }).unique().notNull(),
    backupJobId: (0, pg_core_1.varchar)('backup_job_id', { length: 100 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).notNull().default('pending'),
    targetDatabase: (0, pg_core_1.varchar)('target_database', { length: 100 }),
    restorePoint: (0, pg_core_1.timestamp)('restore_point'),
    startedAt: (0, pg_core_1.timestamp)('started_at').defaultNow(),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
    error: (0, pg_core_1.text)('error'),
    metadata: (0, pg_core_1.json)('metadata'),
    createdBy: (0, pg_core_1.varchar)('created_by', { length: 100 }).notNull(),
});
exports.backupSchedules = (0, pg_core_1.pgTable)('backup_schedules', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    cronExpression: (0, pg_core_1.varchar)('cron_expression', { length: 50 }).notNull(),
    backupType: (0, pg_core_1.varchar)('backup_type', { length: 50 }).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    lastRun: (0, pg_core_1.timestamp)('last_run'),
    nextRun: (0, pg_core_1.timestamp)('next_run'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map