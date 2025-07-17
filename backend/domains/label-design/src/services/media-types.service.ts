import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateMediaTypeDto, UpdateMediaTypeDto } from '../dto/media-types.dto';

@Injectable()
export class MediaTypesService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  async findAll(active?: boolean) {
    try {
      let query = 'SELECT * FROM label_media_types';
      const params: any[] = [];
      
      if (active !== undefined) {
        query += ' WHERE is_active = $1';
        params.push(active);
      }
      
      query += ' ORDER BY name';
      
      const result = await this.pool.query(query, params);
      
      // Transform to proper Media Type format (Physical Properties)
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        manufacturer: 'Avery', // Default manufacturer
        productCode: row.avery_code,
        description: row.description,
        
        // Physical Dimensions (in mm)
        physicalProperties: {
          labelWidth: parseFloat(row.width_mm || 50),
          labelHeight: parseFloat(row.height_mm || 25),
          pageWidth: parseFloat(row.width_mm || 210),
          pageHeight: parseFloat(row.height_mm || 297),
          
          // Layout Configuration
          labelsPerRow: 1,
          labelsPerColumn: 1,
          totalLabelsPerSheet: 1,
          
          // Margins and Spacing (in mm)
          marginTop: 0,
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
          horizontalSpacing: 0,
          verticalSpacing: 0
        },
        
        // Media Type Properties
        mediaType: row.type || 'sheet',
        orientation: 'portrait',
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching media types:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      'SELECT * FROM label_media_types WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Media type with ID ${id} not found`);
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      manufacturer: 'Avery',
      productCode: row.avery_code,
      description: row.description,
      
      // Physical Properties
      physicalProperties: {
        labelWidth: parseFloat(row.width_mm || 50),
        labelHeight: parseFloat(row.height_mm || 25),
        pageWidth: parseFloat(row.width_mm || 210),
        pageHeight: parseFloat(row.height_mm || 297),
        
        labelsPerRow: 1,
        labelsPerColumn: 1,
        totalLabelsPerSheet: 1,
        
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        horizontalSpacing: 0,
        verticalSpacing: 0
      },
      
      mediaType: row.type || 'sheet',
      orientation: 'portrait',
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async create(createDto: CreateMediaTypeDto) {
    const result = await this.pool.query(
      `INSERT INTO label_media_types (
        name, avery_code, description, 
        width_mm, height_mm, type,
        is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id`,
      [
        createDto.name,
        createDto.productCode,
        createDto.description,
        createDto.physicalProperties.labelWidth,
        createDto.physicalProperties.labelHeight,
        createDto.mediaType || 'sheet',
        true
      ]
    );
    
    return this.findOne(result.rows[0].id);
  }

  async update(id: number, updateDto: UpdateMediaTypeDto) {
    // Check if exists
    await this.findOne(id);
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (updateDto.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(updateDto.name);
    }
    
    if (updateDto.productCode) {
      updates.push(`avery_code = $${paramIndex++}`);
      values.push(updateDto.productCode);
    }
    
    if (updateDto.description) {
      updates.push(`description = $${paramIndex++}`);
      values.push(updateDto.description);
    }
    
    if (updateDto.mediaType) {
      updates.push(`type = $${paramIndex++}`);
      values.push(updateDto.mediaType);
    }
    
    if (updateDto.isActive !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(updateDto.isActive);
    }
    
    if (updateDto.physicalProperties) {
      const props = updateDto.physicalProperties;
      if (props.labelWidth) {
        updates.push(`width_mm = $${paramIndex++}`);
        values.push(props.labelWidth);
      }
      if (props.labelHeight) {
        updates.push(`height_mm = $${paramIndex++}`);
        values.push(props.labelHeight);
      }
    }
    
    if (updates.length === 0) {
      return this.findOne(id);
    }
    
    updates.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());
    
    values.push(id);
    const query = `UPDATE label_media_types SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
    
    await this.pool.query(query, values);
    
    return this.findOne(id);
  }

  async delete(id: number) {
    await this.findOne(id);
    
    await this.pool.query(
      'DELETE FROM label_media_types WHERE id = $1',
      [id]
    );
  }
}