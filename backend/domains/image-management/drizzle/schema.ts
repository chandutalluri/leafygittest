
import { pgTable, text, uuid, timestamp, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core';

// Complete image management service schema
export const image_management_images = pgTable('image_management_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  path: text('path').notNull(),
  entityType: text('entity_type'),
  entityId: integer('entity_id'),
  category: text('category'),
  description: text('description'),
  tags: text('tags'),
  isPublic: boolean('is_public').default(true),
  variants: jsonb('variants'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow()
});

export const image_management_albums = pgTable('image_management_albums', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  coverImageId: uuid('cover_image_id'),
  entityType: text('entity_type'),
  entityId: integer('entity_id'),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const image_management_metadata = pgTable('image_management_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  imageId: uuid('image_id').notNull(),
  key: text('key').notNull(),
  value: text('value'),
  type: text('type').default('string'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const image_management_transformations = pgTable('image_management_transformations', {
  id: uuid('id').primaryKey().defaultRandom(),
  imageId: uuid('image_id').notNull(),
  transformationType: text('transformation_type').notNull(),
  parameters: jsonb('parameters'),
  outputPath: text('output_path'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Export all tables for type inference
export type ImageManagementSchema = {
  image_management_images: typeof image_management_images;
  image_management_albums: typeof image_management_albums;
  image_management_metadata: typeof image_management_metadata;
  image_management_transformations: typeof image_management_transformations;
};
