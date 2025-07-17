-- Image Management Service Database Schema
-- Creating tables for production-ready image management

-- Main images table
CREATE TABLE IF NOT EXISTS image_management_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    path TEXT NOT NULL,
    entity_type TEXT,
    entity_id INTEGER,
    category TEXT,
    description TEXT,
    tags TEXT,
    is_public BOOLEAN DEFAULT true,
    variants JSONB,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Albums table for organizing images
CREATE TABLE IF NOT EXISTS image_management_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    cover_image_id UUID,
    entity_type TEXT,
    entity_id INTEGER,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Metadata table for additional image properties
CREATE TABLE IF NOT EXISTS image_management_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    type TEXT DEFAULT 'string',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Transformations table for image processing history
CREATE TABLE IF NOT EXISTS image_management_transformations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID NOT NULL,
    transformation_type TEXT NOT NULL,
    parameters JSONB,
    output_path TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_images_entity ON image_management_images(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_images_category ON image_management_images(category);
CREATE INDEX IF NOT EXISTS idx_images_upload_date ON image_management_images(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_metadata_image_id ON image_management_metadata(image_id);
CREATE INDEX IF NOT EXISTS idx_transformations_image_id ON image_management_transformations(image_id);