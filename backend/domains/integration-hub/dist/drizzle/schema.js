"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integration_hub_logs = exports.integration_hub_api_keys = exports.integration_hub_webhooks = exports.integration_hub_integrations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.integration_hub_integrations = (0, pg_core_1.pgTable)('integration_hub_integrations', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.integration_hub_webhooks = (0, pg_core_1.pgTable)('integration_hub_webhooks', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.integration_hub_api_keys = (0, pg_core_1.pgTable)('integration_hub_api_keys', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.integration_hub_logs = (0, pg_core_1.pgTable)('integration_hub_logs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map