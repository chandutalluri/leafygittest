"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multi_language_management_content = exports.multi_language_management_locales = exports.multi_language_management_translations = exports.multi_language_management_languages = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.multi_language_management_languages = (0, pg_core_1.pgTable)('multi_language_management_languages', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.multi_language_management_translations = (0, pg_core_1.pgTable)('multi_language_management_translations', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.multi_language_management_locales = (0, pg_core_1.pgTable)('multi_language_management_locales', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.multi_language_management_content = (0, pg_core_1.pgTable)('multi_language_management_content', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map