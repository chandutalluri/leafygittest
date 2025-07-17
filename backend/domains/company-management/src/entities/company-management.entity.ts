import { pgTable, serial, varchar, text, timestamp, boolean, jsonb, integer, numeric } from 'drizzle-orm/pg-core';

// Companies table - matching actual database structure
export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  logo: varchar('logo', { length: 500 }),
  website: varchar('website', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postal_code: varchar('postal_code', { length: 20 }),
  tax_id: varchar('tax_id', { length: 50 }),
  registration_number: varchar('registration_number', { length: 100 }),
  fssai_license: varchar('fssai_license', { length: 50 }),
  gst_number: varchar('gst_number', { length: 15 }),
  industry: varchar('industry', { length: 100 }),
  founded_year: integer('founded_year'),
  employee_count: integer('employee_count'),
  annual_revenue: numeric('annual_revenue', { precision: 15, scale: 2 }),
  settings: jsonb('settings'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// Branches table - matching actual database structure
export const branches = pgTable('branches', {
  id: serial('id').primaryKey(),
  company_id: integer('company_id').notNull().references(() => companies.id),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  postal_code: varchar('postal_code', { length: 20 }),
  latitude: numeric('latitude', { precision: 10, scale: 8 }),
  longitude: numeric('longitude', { precision: 11, scale: 8 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  manager_name: varchar('manager_name', { length: 255 }),
  operating_hours: jsonb('operating_hours'),
  delivery_radius: numeric('delivery_radius', { precision: 10, scale: 2 }),
  settings: jsonb('settings'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// Types
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Branch = typeof branches.$inferSelect;
export type NewBranch = typeof branches.$inferInsert;