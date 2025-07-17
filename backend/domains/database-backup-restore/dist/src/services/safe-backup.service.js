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
var SafeBackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeBackupService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
let SafeBackupService = SafeBackupService_1 = class SafeBackupService {
    constructor() {
        this.logger = new common_1.Logger(SafeBackupService_1.name);
        this.backupDir = path.join(process.cwd(), 'backups');
        this.ensureBackupDir();
    }
    ensureBackupDir() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }
    async createSafeBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `safe-json-backup-${timestamp}.json`;
        const filePath = path.join(this.backupDir, fileName);
        const backupPool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            max: 1,
            connectionTimeoutMillis: 5000,
        });
        try {
            this.logger.log('Starting safe JSON backup...');
            const startTime = Date.now();
            const backupData = {
                metadata: {
                    timestamp: new Date().toISOString(),
                    version: '1.0',
                    type: 'safe-json-backup',
                },
                data: {},
            };
            const criticalTables = [
                'users',
                'companies',
                'branches',
                'categories',
                'products',
                'inventory',
                'customers',
                'orders',
                'order_items',
                'settings',
                'custom_template_dimensions',
                'custom_templates',
            ];
            for (const table of criticalTables) {
                try {
                    const result = await backupPool.query(`SELECT * FROM ${table}`);
                    backupData.data[table] = result.rows;
                    this.logger.log(`Backed up ${result.rows.length} rows from ${table}`);
                }
                catch (error) {
                    this.logger.warn(`Skipping table ${table}: ${error.message}`);
                }
            }
            const jsonContent = JSON.stringify(backupData, null, 2);
            fs.writeFileSync(filePath, jsonContent);
            const stats = fs.statSync(filePath);
            const fileSize = (stats.size / 1024).toFixed(2) + ' KB';
            const checksum = crypto
                .createHash('sha256')
                .update(jsonContent)
                .digest('hex')
                .substring(0, 16);
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            const metadata = {
                fileName,
                filePath,
                size: fileSize,
                checksum,
                tableCount: Object.keys(backupData.data).length,
                totalRows: Object.values(backupData.data).reduce((sum, rows) => sum + rows.length, 0),
                duration: `${duration}s`,
                createdAt: new Date().toISOString(),
            };
            const metadataPath = filePath.replace('.json', '-metadata.json');
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
            this.logger.log(`Safe backup completed: ${fileName}`);
            return {
                success: true,
                message: `Backup completed successfully in ${duration}s`,
                metadata,
            };
        }
        catch (error) {
            this.logger.error('Safe backup failed:', error);
            return {
                success: false,
                message: `Backup failed: ${error.message}`,
            };
        }
        finally {
            await backupPool.end();
        }
    }
    async listBackups() {
        try {
            const files = fs.readdirSync(this.backupDir);
            const backups = [];
            for (const file of files) {
                if (file.endsWith('-metadata.json')) {
                    const metadataPath = path.join(this.backupDir, file);
                    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
                    backups.push(metadata);
                }
            }
            return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        catch (error) {
            this.logger.error('Error listing backups:', error);
            return [];
        }
    }
    async deleteBackup(fileName) {
        try {
            const filePath = path.join(this.backupDir, fileName);
            const metadataPath = filePath.replace('.json', '-metadata.json');
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            if (fs.existsSync(metadataPath)) {
                fs.unlinkSync(metadataPath);
            }
            this.logger.log(`Deleted backup: ${fileName}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error deleting backup: ${error.message}`);
            return false;
        }
    }
};
exports.SafeBackupService = SafeBackupService;
exports.SafeBackupService = SafeBackupService = SafeBackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SafeBackupService);
//# sourceMappingURL=safe-backup.service.js.map