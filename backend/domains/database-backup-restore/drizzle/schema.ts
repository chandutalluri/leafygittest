import { pgTable, serial, varchar, timestamp, json, boolean, text, integer } from 'drizzle-orm/pg-core';

export const backupJobs = pgTable('backup_jobs', {
  id: serial('id').primaryKey(),
  jobId: varchar('job_id', { length: 100 }).unique().notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'manual', 'scheduled', 'emergency'
  status: varchar('status', { length: 50 }).notNull().default('pending'), // 'pending', 'running', 'completed', 'failed'
  fileName: varchar('file_name', { length: 255 }),
  gcsPath: varchar('gcs_path', { length: 500 }),
  fileSize: varchar('file_size', { length: 50 }),
  checksum: varchar('checksum', { length: 64 }),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  error: text('error'),
  metadata: json('metadata'),
  createdBy: varchar('created_by', { length: 100 }).notNull(),
});

export const restoreJobs = pgTable('restore_jobs', {
  id: serial('id').primaryKey(),
  jobId: varchar('job_id', { length: 100 }).unique().notNull(),
  backupJobId: varchar('backup_job_id', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  targetDatabase: varchar('target_database', { length: 100 }),
  restorePoint: timestamp('restore_point'),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  error: text('error'),
  metadata: json('metadata'),
  createdBy: varchar('created_by', { length: 100 }).notNull(),
});

export const backupSchedules = pgTable('backup_schedules', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  cronExpression: varchar('cron_expression', { length: 50 }).notNull(),
  backupType: varchar('backup_type', { length: 50 }).notNull(),
  isActive: boolean('is_active').default(true),
  lastRun: timestamp('last_run'),
  nextRun: timestamp('next_run'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Type exports
export type BackupJob = typeof backupJobs.$inferSelect;
export type NewBackupJob = typeof backupJobs.$inferInsert;
export type RestoreJob = typeof restoreJobs.$inferSelect;
export type NewRestoreJob = typeof restoreJobs.$inferInsert;
export type BackupSchedule = typeof backupSchedules.$inferSelect;
export type NewBackupSchedule = typeof backupSchedules.$inferInsert;