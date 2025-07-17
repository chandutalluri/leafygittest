import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateCustomTemplateDto, UpdateCustomTemplateDto } from '../dto/print-label.dto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

@Injectable()
export class CustomTemplateService {

  async createCustomTemplate(createDto: CreateCustomTemplateDto) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(`
          INSERT INTO custom_template_dimensions (
            name, description, paper_size, paper_width, paper_height,
            label_width, label_height, horizontal_count, vertical_count,
            margin_top, margin_bottom, margin_left, margin_right,
            horizontal_gap, vertical_gap, corner_radius, template_type,
            created_by, company_id, branch_id, is_active, is_public,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
            $14, $15, $16, $17, $18, $19, $20, true, false, NOW(), NOW()
          ) RETURNING *
        `, [
          createDto.name,
          createDto.description,
          createDto.paperSize,
          createDto.paperWidth,
          createDto.paperHeight,
          createDto.labelWidth,
          createDto.labelHeight,
          createDto.horizontalCount,
          createDto.verticalCount,
          createDto.marginTop,
          createDto.marginBottom,
          createDto.marginLeft,
          createDto.marginRight,
          createDto.horizontalGap,
          createDto.verticalGap,
          createDto.cornerRadius || 0,
          createDto.templateType,
          createDto.createdBy,
          createDto.companyId,
          createDto.branchId
        ]);

        return {
          success: true,
          data: result.rows[0],
          message: 'Custom template created successfully'
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error creating custom template:', error);
      return {
        success: false,
        error: 'Failed to create custom template',
        details: error.message
      };
    }
  }

  async getCustomTemplates(filters: { templateType?: string, branchId?: number, companyId?: number }) {
    try {
      const client = await pool.connect();
      try {
        let whereClause = 'WHERE is_active = true';
        const queryParams = [];
        let paramCount = 1;

        if (filters.templateType) {
          whereClause += ` AND template_type = $${paramCount}`;
          queryParams.push(filters.templateType);
          paramCount++;
        }

        if (filters.branchId) {
          whereClause += ` AND branch_id = $${paramCount}`;
          queryParams.push(filters.branchId);
          paramCount++;
        }

        if (filters.companyId) {
          whereClause += ` AND company_id = $${paramCount}`;
          queryParams.push(filters.companyId);
          paramCount++;
        }

        const result = await client.query(`
          SELECT * FROM custom_template_dimensions 
          ${whereClause}
          ORDER BY created_at DESC
        `, queryParams);

        return {
          success: true,
          data: result.rows,
          total: result.rows.length,
          message: `Found ${result.rows.length} custom templates`
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error fetching custom templates:', error);
      return {
        success: false,
        error: 'Failed to fetch custom templates',
        details: error.message
      };
    }
  }

  async getCustomTemplateById(id: number) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(`
          SELECT * FROM custom_template_dimensions 
          WHERE id = $1 AND is_active = true
        `, [id]);

        if (result.rows.length === 0) {
          return {
            success: false,
            error: 'Custom template not found'
          };
        }

        return {
          success: true,
          data: result.rows[0],
          message: 'Custom template retrieved successfully'
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error fetching custom template by ID:', error);
      return {
        success: false,
        error: 'Failed to fetch custom template',
        details: error.message
      };
    }
  }

  async updateCustomTemplate(id: number, updateDto: UpdateCustomTemplateDto) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(`
          UPDATE custom_template_dimensions SET
            name = $1, description = $2, paper_size = $3, paper_width = $4, paper_height = $5,
            label_width = $6, label_height = $7, horizontal_count = $8, vertical_count = $9,
            margin_top = $10, margin_bottom = $11, margin_left = $12, margin_right = $13,
            horizontal_gap = $14, vertical_gap = $15, corner_radius = $16, template_type = $17,
            updated_at = NOW()
          WHERE id = $18 AND is_active = true
          RETURNING *
        `, [
          updateDto.name,
          updateDto.description,
          updateDto.paperSize,
          updateDto.paperWidth,
          updateDto.paperHeight,
          updateDto.labelWidth,
          updateDto.labelHeight,
          updateDto.horizontalCount,
          updateDto.verticalCount,
          updateDto.marginTop,
          updateDto.marginBottom,
          updateDto.marginLeft,
          updateDto.marginRight,
          updateDto.horizontalGap,
          updateDto.verticalGap,
          updateDto.cornerRadius || 0,
          updateDto.templateType,
          id
        ]);

        if (result.rows.length === 0) {
          return {
            success: false,
            error: 'Custom template not found'
          };
        }

        return {
          success: true,
          data: result.rows[0],
          message: 'Custom template updated successfully'
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error updating custom template:', error);
      return {
        success: false,
        error: 'Failed to update custom template',
        details: error.message
      };
    }
  }

  async deleteCustomTemplate(id: number) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(`
          UPDATE custom_template_dimensions 
          SET is_active = false, updated_at = NOW()
          WHERE id = $1 AND is_active = true
          RETURNING *
        `, [id]);

        if (result.rows.length === 0) {
          return {
            success: false,
            error: 'Custom template not found'
          };
        }

        return {
          success: true,
          data: result.rows[0],
          message: 'Custom template deleted successfully'
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error deleting custom template:', error);
      return {
        success: false,
        error: 'Failed to delete custom template',
        details: error.message
      };
    }
  }

  async generatePreview(id: number) {
    try {
      const templateResult = await this.getCustomTemplateById(id);
      
      if (!templateResult.success) {
        return templateResult;
      }

      const templateData = templateResult.data;
      
      // Generate preview data showing the label layout
      const previewData = {
        templateId: id,
        name: templateData.name,
        layout: {
          paperSize: templateData.paper_size,
          paperDimensions: {
            width: parseFloat(templateData.paper_width),
            height: parseFloat(templateData.paper_height)
          },
          labelDimensions: {
            width: parseFloat(templateData.label_width),
            height: parseFloat(templateData.label_height)
          },
          grid: {
            columns: templateData.horizontal_count,
            rows: templateData.vertical_count,
            totalLabels: templateData.horizontal_count * templateData.vertical_count
          },
          margins: {
            top: parseFloat(templateData.margin_top),
            bottom: parseFloat(templateData.margin_bottom),
            left: parseFloat(templateData.margin_left),
            right: parseFloat(templateData.margin_right)
          },
          gaps: {
            horizontal: parseFloat(templateData.horizontal_gap),
            vertical: parseFloat(templateData.vertical_gap)
          },
          cornerRadius: parseFloat(templateData.corner_radius || '0')
        },
        previewUrl: `/api/custom-templates/${id}/preview-image`
      };

      return {
        success: true,
        data: previewData,
        message: 'Custom template preview generated successfully'
      };
    } catch (error) {
      console.error('Error generating custom template preview:', error);
      return {
        success: false,
        error: 'Failed to generate custom template preview',
        details: error.message
      };
    }
  }

  async getUsageStats() {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(`
          SELECT 
            template_type,
            paper_size,
            horizontal_count,
            vertical_count,
            COUNT(*) as count
          FROM custom_template_dimensions 
          WHERE is_active = true
          GROUP BY template_type, paper_size, horizontal_count, vertical_count
          ORDER BY count DESC
        `);

        const stats = result.rows;
        
        const templateTypeStats = {};
        const paperSizeStats = {};
        let totalLabelCount = 0;
        let totalTemplates = 0;

        stats.forEach(stat => {
          templateTypeStats[stat.template_type] = (templateTypeStats[stat.template_type] || 0) + parseInt(stat.count);
          paperSizeStats[stat.paper_size] = (paperSizeStats[stat.paper_size] || 0) + parseInt(stat.count);
          totalLabelCount += (stat.horizontal_count * stat.vertical_count) * parseInt(stat.count);
          totalTemplates += parseInt(stat.count);
        });

        return {
          success: true,
          data: {
            totalTemplates,
            templateTypeBreakdown: templateTypeStats,
            paperSizeBreakdown: paperSizeStats,
            averageLabelCount: totalTemplates > 0 ? totalLabelCount / totalTemplates : 0
          },
          message: 'Custom template usage stats retrieved successfully'
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error fetching custom template usage stats:', error);
      return {
        success: false,
        error: 'Failed to fetch custom template usage stats',
        details: error.message
      };
    }
  }
}