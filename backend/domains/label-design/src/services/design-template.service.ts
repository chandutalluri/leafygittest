import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateDesignTemplateDto, UpdateDesignTemplateDto } from '../dto/design-template.dto';

@Injectable()
export class DesignTemplateService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  async findAll(active?: boolean) {
    try {
      let query = `
        SELECT 
          lt.*,
          lmt.name as media_type_name,
          lmt.avery_code as media_type_code,
          lmt.width_mm as media_width,
          lmt.height_mm as media_height
        FROM label_templates lt
        LEFT JOIN label_media_types lmt ON lt.media_type_id = lmt.id
      `;
      const params: any[] = [];
      
      if (active !== undefined) {
        query += ' WHERE lt.is_active = $1';
        params.push(active);
      }
      
      query += ' ORDER BY lt.name';
      
      const result = await this.pool.query(query, params);
      
      // Transform to proper Design Template format
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        
        // Media Type Reference (Physical Properties)
        mediaTypeId: row.media_type_id,
        mediaTypeName: row.media_type_name,
        mediaTypeCode: row.media_type_code,
        
        // Design Template Data (Content Layout)
        templateData: row.template_data || {},
        
        // Template Status
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching design templates:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      `SELECT 
        lt.*,
        lmt.name as media_type_name,
        lmt.avery_code as media_type_code,
        lmt.width_mm as media_width,
        lmt.height_mm as media_height
      FROM label_templates lt
      LEFT JOIN label_media_types lmt ON lt.media_type_id = lmt.id
      WHERE lt.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Design template with ID ${id} not found`);
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      
      // Media Type Reference
      mediaTypeId: row.media_type_id,
      mediaTypeName: row.media_type_name,
      mediaTypeCode: row.media_type_code,
      
      // Design Template Data
      templateData: row.template_data || {},
      
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async create(createDto: CreateDesignTemplateDto) {
    // Verify media type exists
    const mediaTypeCheck = await this.pool.query(
      'SELECT id FROM label_media_types WHERE id = $1 AND is_active = true',
      [createDto.mediaTypeId]
    );
    
    if (mediaTypeCheck.rows.length === 0) {
      throw new NotFoundException(`Media type with ID ${createDto.mediaTypeId} not found or inactive`);
    }
    
    const result = await this.pool.query(
      `INSERT INTO label_templates (
        name, description, category, media_type_id, template_data,
        is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id`,
      [
        createDto.name,
        createDto.description,
        createDto.category,
        createDto.mediaTypeId,
        JSON.stringify(createDto.templateData),
        true
      ]
    );
    
    return this.findOne(result.rows[0].id);
  }

  async update(id: number, updateDto: UpdateDesignTemplateDto) {
    // Check if exists
    await this.findOne(id);
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (updateDto.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(updateDto.name);
    }
    
    if (updateDto.description) {
      updates.push(`description = $${paramIndex++}`);
      values.push(updateDto.description);
    }
    
    if (updateDto.category) {
      updates.push(`category = $${paramIndex++}`);
      values.push(updateDto.category);
    }
    
    if (updateDto.mediaTypeId) {
      // Verify media type exists
      const mediaTypeCheck = await this.pool.query(
        'SELECT id FROM label_media_types WHERE id = $1 AND is_active = true',
        [updateDto.mediaTypeId]
      );
      
      if (mediaTypeCheck.rows.length === 0) {
        throw new NotFoundException(`Media type with ID ${updateDto.mediaTypeId} not found or inactive`);
      }
      
      updates.push(`media_type_id = $${paramIndex++}`);
      values.push(updateDto.mediaTypeId);
    }
    
    if (updateDto.templateData) {
      updates.push(`template_data = $${paramIndex++}`);
      values.push(JSON.stringify(updateDto.templateData));
    }
    
    if (updateDto.isActive !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(updateDto.isActive);
    }
    
    if (updates.length === 0) {
      return this.findOne(id);
    }
    
    updates.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());
    
    values.push(id);
    const query = `UPDATE label_templates SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
    
    await this.pool.query(query, values);
    
    return this.findOne(id);
  }

  async delete(id: number) {
    await this.findOne(id);
    
    await this.pool.query(
      'DELETE FROM label_templates WHERE id = $1',
      [id]
    );
  }
}