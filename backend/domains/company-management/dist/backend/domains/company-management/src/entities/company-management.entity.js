"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branches = exports.companies = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.companies = (0, pg_core_1.pgTable)('companies', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    logo: (0, pg_core_1.varchar)('logo', { length: 500 }),
    website: (0, pg_core_1.varchar)('website', { length: 255 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    address: (0, pg_core_1.text)('address'),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 100 }),
    country: (0, pg_core_1.varchar)('country', { length: 100 }),
    postal_code: (0, pg_core_1.varchar)('postal_code', { length: 20 }),
    tax_id: (0, pg_core_1.varchar)('tax_id', { length: 50 }),
    registration_number: (0, pg_core_1.varchar)('registration_number', { length: 100 }),
    fssai_license: (0, pg_core_1.varchar)('fssai_license', { length: 50 }),
    gst_number: (0, pg_core_1.varchar)('gst_number', { length: 15 }),
    industry: (0, pg_core_1.varchar)('industry', { length: 100 }),
    founded_year: (0, pg_core_1.integer)('founded_year'),
    employee_count: (0, pg_core_1.integer)('employee_count'),
    annual_revenue: (0, pg_core_1.numeric)('annual_revenue', { precision: 15, scale: 2 }),
    settings: (0, pg_core_1.jsonb)('settings'),
    is_active: (0, pg_core_1.boolean)('is_active').default(true),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.branches = (0, pg_core_1.pgTable)('branches', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    company_id: (0, pg_core_1.integer)('company_id').notNull().references(() => exports.companies.id),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).notNull(),
    address: (0, pg_core_1.text)('address').notNull(),
    city: (0, pg_core_1.varchar)('city', { length: 100 }).notNull(),
    state: (0, pg_core_1.varchar)('state', { length: 100 }).notNull(),
    country: (0, pg_core_1.varchar)('country', { length: 100 }).notNull(),
    postal_code: (0, pg_core_1.varchar)('postal_code', { length: 20 }),
    latitude: (0, pg_core_1.numeric)('latitude', { precision: 10, scale: 8 }),
    longitude: (0, pg_core_1.numeric)('longitude', { precision: 11, scale: 8 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 50 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    manager_name: (0, pg_core_1.varchar)('manager_name', { length: 255 }),
    operating_hours: (0, pg_core_1.jsonb)('operating_hours'),
    delivery_radius: (0, pg_core_1.numeric)('delivery_radius', { precision: 10, scale: 2 }),
    settings: (0, pg_core_1.jsonb)('settings'),
    is_active: (0, pg_core_1.boolean)('is_active').default(true),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
//# sourceMappingURL=company-management.entity.js.map