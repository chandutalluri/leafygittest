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
exports.MediaTypesService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let MediaTypesService = class MediaTypesService {
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
            return result.rows.map(row => ({
                id: row.id,
                name: row.name,
                manufacturer: 'Avery',
                productCode: row.avery_code,
                description: row.description,
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
            }));
        }
        catch (error) {
            console.error('Error fetching media types:', error);
            throw error;
        }
    }
    async findOne(id) {
        const result = await this.pool.query('SELECT * FROM label_media_types WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Media type with ID ${id} not found`);
        }
        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            manufacturer: 'Avery',
            productCode: row.avery_code,
            description: row.description,
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
    async create(createDto) {
        const result = await this.pool.query(`INSERT INTO label_media_types (
        name, avery_code, description, 
        width_mm, height_mm, type,
        is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id`, [
            createDto.name,
            createDto.productCode,
            createDto.description,
            createDto.physicalProperties.labelWidth,
            createDto.physicalProperties.labelHeight,
            createDto.mediaType || 'sheet',
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
    async delete(id) {
        await this.findOne(id);
        await this.pool.query('DELETE FROM label_media_types WHERE id = $1', [id]);
    }
};
exports.MediaTypesService = MediaTypesService;
exports.MediaTypesService = MediaTypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MediaTypesService);
//# sourceMappingURL=media-types.service.js.map