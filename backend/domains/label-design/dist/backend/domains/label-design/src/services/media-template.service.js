"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaTemplateService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let MediaTemplateService = class MediaTemplateService {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL
        });
    }
    async findAll(active) {
        try {
            let query = 'SELECT * FROM label_media_types';
            const params = [];
            if (active !== undefined) {
                query += ' WHERE is_active = $1';
                params.push(active);
            }
            query += ' ORDER BY name';
            const result = await this.pool.query(query, params);
            return result.rows.map(template => ({
                id: template.id,
                name: template.name,
                code: template.avery_code,
                manufacturer: 'Avery',
                description: template.description,
                dimensions: {
                    pageWidth: parseFloat(template.width_mm || 210),
                    pageHeight: parseFloat(template.height_mm || 297),
                    labelWidth: parseFloat(template.width_mm || 50),
                    labelHeight: parseFloat(template.height_mm || 25),
                    columns: 1,
                    rows: 1,
                    marginTop: 0,
                    marginLeft: 0,
                    spacingX: 0,
                    spacingY: 0
                },
                orientation: 'portrait',
                isActive: template.is_active,
                mediaType: template.type,
                isRoll: template.type === 'roll',
                isSheet: template.type === 'sheet'
            }));
        }
        catch (error) {
            console.error('Error fetching media templates:', error);
            throw error;
        }
    }
    async findOne(id) {
        const result = await this.pool.query('SELECT * FROM label_media_types WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Media template with ID ${id} not found`);
        }
        const t = result.rows[0];
        return {
            id: t.id,
            name: t.name,
            code: t.avery_code,
            manufacturer: 'Avery',
            description: t.description,
            dimensions: {
                pageWidth: parseFloat(t.width_mm || 210),
                pageHeight: parseFloat(t.height_mm || 297),
                labelWidth: parseFloat(t.width_mm || 50),
                labelHeight: parseFloat(t.height_mm || 25),
                columns: 1,
                rows: 1,
                marginTop: 0,
                marginLeft: 0,
                spacingX: 0,
                spacingY: 0
            },
            orientation: 'portrait',
            isActive: t.is_active,
            mediaType: t.type,
            isRoll: t.type === 'roll',
            isSheet: t.type === 'sheet'
        };
    }
    async create(createDto) {
        const result = await this.pool.query(`INSERT INTO label_media_types (
        name, avery_code, description, 
        width_mm, height_mm, type,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`, [
            createDto.name,
            createDto.code,
            createDto.description,
            createDto.dimensions.labelWidth,
            createDto.dimensions.labelHeight,
            'sheet',
            true
        ]);
        return this.findOne(result.rows[0].id);
    }
    async update(id, updateDto) {
        await this.findOne(id);
        const updates = [];
        const values = [];
        let paramIndex = 1;
        if (updateDto.name) {
            updates.push(`name = $${paramIndex++}`);
            values.push(updateDto.name);
        }
        if (updateDto.code) {
            updates.push(`avery_code = $${paramIndex++}`);
            values.push(updateDto.code);
        }
        if (updateDto.description) {
            updates.push(`description = $${paramIndex++}`);
            values.push(updateDto.description);
        }
        if (updateDto.isActive !== undefined) {
            updates.push(`is_active = $${paramIndex++}`);
            values.push(updateDto.isActive);
        }
        if (updateDto.dimensions) {
            const dims = updateDto.dimensions;
            if (dims.pageWidth) {
                updates.push(`page_width_mm = $${paramIndex++}`);
                values.push(dims.pageWidth);
            }
            if (dims.pageHeight) {
                updates.push(`page_height_mm = $${paramIndex++}`);
                values.push(dims.pageHeight);
            }
            if (dims.labelWidth) {
                updates.push(`label_width_mm = $${paramIndex++}`);
                values.push(dims.labelWidth);
            }
            if (dims.labelHeight) {
                updates.push(`label_height_mm = $${paramIndex++}`);
                values.push(dims.labelHeight);
            }
            if (dims.columns) {
                updates.push(`columns = $${paramIndex++}`);
                values.push(dims.columns);
            }
            if (dims.rows) {
                updates.push(`rows = $${paramIndex++}`);
                values.push(dims.rows);
            }
            if (dims.marginTop !== undefined) {
                updates.push(`margin_top_mm = $${paramIndex++}`);
                values.push(dims.marginTop);
            }
            if (dims.marginLeft !== undefined) {
                updates.push(`margin_left_mm = $${paramIndex++}`);
                values.push(dims.marginLeft);
            }
            if (dims.spacingX !== undefined) {
                updates.push(`gap_x_mm = $${paramIndex++}`);
                values.push(dims.spacingX);
            }
            if (dims.spacingY !== undefined) {
                updates.push(`gap_y_mm = $${paramIndex++}`);
                values.push(dims.spacingY);
            }
        }
        if (updates.length === 0) {
            return this.findOne(id);
        }
        values.push(id);
        const query = `UPDATE label_media_types SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
        await this.pool.query(query, values);
        return this.findOne(id);
    }
    async delete(id) {
        await this.findOne(id);
        await this.pool.query('DELETE FROM label_media_types WHERE id = $1', [id]);
    }
};
exports.MediaTemplateService = MediaTemplateService;
exports.MediaTemplateService = MediaTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MediaTemplateService);
//# sourceMappingURL=media-template.service.js.map