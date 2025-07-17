"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporting_management_recipients = exports.reporting_management_exports = exports.reporting_management_schedules = exports.reporting_management_reports = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.reporting_management_reports = (0, pg_core_1.pgTable)('reporting_management_reports', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.reporting_management_schedules = (0, pg_core_1.pgTable)('reporting_management_schedules', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.reporting_management_exports = (0, pg_core_1.pgTable)('reporting_management_exports', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.reporting_management_recipients = (0, pg_core_1.pgTable)('reporting_management_recipients', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map