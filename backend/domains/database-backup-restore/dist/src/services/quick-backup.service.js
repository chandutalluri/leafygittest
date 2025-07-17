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
var QuickBackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickBackupService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const path_1 = require("path");
const fs_1 = require("fs");
let QuickBackupService = QuickBackupService_1 = class QuickBackupService {
    constructor() {
        this.logger = new common_1.Logger(QuickBackupService_1.name);
        this.backupDir = (0, path_1.join)(process.cwd(), 'backups');
        this.ensureBackupDir();
    }
    async ensureBackupDir() {
        await fs_1.promises.mkdir(this.backupDir, { recursive: true });
    }
    async createQuickBackup() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `quick-backup-${timestamp}.sql`;
            const filePath = (0, path_1.join)(this.backupDir, fileName);
            const dbUrl = new URL(process.env.DATABASE_URL);
            this.logger.log('Starting quick data-only backup...');
            const result = await new Promise((resolve) => {
                const pgDump = (0, child_process_1.spawn)('pg_dump', [
                    dbUrl.toString(),
                    '--data-only',
                    '--no-owner',
                    '--no-privileges',
                    '--exclude-table=sessions',
                    '--exclude-table=logs',
                    '--exclude-table=backup_jobs',
                    '--exclude-table=restore_jobs',
                    '--file=' + filePath,
                ], {
                    timeout: 60000,
                });
                let stderr = '';
                pgDump.stderr.on('data', (data) => {
                    stderr += data.toString();
                });
                pgDump.on('error', (error) => {
                    this.logger.error('pg_dump error:', error);
                    resolve({ success: false, error: error.message });
                });
                pgDump.on('close', (code) => {
                    if (code === 0) {
                        resolve({ success: true });
                    }
                    else {
                        resolve({ success: false, error: stderr || `Exit code ${code}` });
                    }
                });
            });
            if (!result.success) {
                throw new Error(result.error || 'Backup failed');
            }
            const stats = await fs_1.promises.stat(filePath);
            const fileSize = this.formatBytes(stats.size);
            this.logger.log(`Quick backup completed: ${fileName} (${fileSize})`);
            return {
                success: true,
                message: `Quick backup created successfully`,
                file: fileName
            };
        }
        catch (error) {
            this.logger.error('Quick backup failed:', error);
            return {
                success: false,
                message: `Quick backup failed: ${error.message}`
            };
        }
    }
    async createJsonExport() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `data-export-${timestamp}.json`;
            const filePath = (0, path_1.join)(this.backupDir, fileName);
            this.logger.log('Starting JSON data export...');
            const { db } = require('../../drizzle/db');
            const schema = require('@shared/schema');
            const exportData = {
                exportDate: new Date().toISOString(),
                version: '1.0',
                tables: {}
            };
            const tablesToExport = [
                'users',
                'companies',
                'branches',
                'categories',
                'products',
                'inventory',
                'customers',
                'orders',
                'order_items'
            ];
            for (const tableName of tablesToExport) {
                try {
                    if (schema[tableName]) {
                        const data = await db.select().from(schema[tableName]);
                        exportData.tables[tableName] = data;
                        this.logger.log(`Exported ${data.length} records from ${tableName}`);
                    }
                }
                catch (err) {
                    this.logger.warn(`Could not export ${tableName}: ${err.message}`);
                }
            }
            await fs_1.promises.writeFile(filePath, JSON.stringify(exportData, null, 2));
            const stats = await fs_1.promises.stat(filePath);
            const fileSize = this.formatBytes(stats.size);
            this.logger.log(`JSON export completed: ${fileName} (${fileSize})`);
            return {
                success: true,
                message: `Data export created successfully`,
                file: fileName
            };
        }
        catch (error) {
            this.logger.error('JSON export failed:', error);
            return {
                success: false,
                message: `Export failed: ${error.message}`
            };
        }
    }
    formatBytes(bytes) {
        if (bytes < 1024)
            return bytes + ' B';
        if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
};
exports.QuickBackupService = QuickBackupService;
exports.QuickBackupService = QuickBackupService = QuickBackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QuickBackupService);
//# sourceMappingURL=quick-backup.service.js.map