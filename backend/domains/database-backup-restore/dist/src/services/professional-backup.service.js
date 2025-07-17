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
var ProfessionalBackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalBackupService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const fsPromises = fs.promises;
let ProfessionalBackupService = ProfessionalBackupService_1 = class ProfessionalBackupService {
    constructor() {
        this.logger = new common_1.Logger(ProfessionalBackupService_1.name);
        this.backupDir = path.join(process.cwd(), 'backups');
        this.ensureBackupDirectory();
    }
    async ensureBackupDirectory() {
        try {
            await fsPromises.mkdir(this.backupDir, { recursive: true });
        }
        catch (error) {
            this.logger.error(`Failed to create backup directory: ${error.message}`);
        }
    }
    async createProfessionalBackup(type = 'custom') {
        try {
            this.logger.log('Starting professional PostgreSQL backup...');
            const databaseUrl = process.env.DATABASE_URL;
            const urlParts = new URL(databaseUrl);
            const config = {
                host: urlParts.hostname,
                port: urlParts.port || '5432',
                user: urlParts.username,
                password: urlParts.password,
                database: urlParts.pathname.slice(1),
            };
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const extension = type === 'logical' ? 'sql' : 'dump';
            const fileName = `professional-backup-${timestamp}.${extension}`;
            const filePath = path.join(this.backupDir, fileName);
            let command;
            if (type === 'logical') {
                command = `PGPASSWORD="${config.password}" pg_dump ` +
                    `-h "${config.host}" ` +
                    `-p "${config.port}" ` +
                    `-U "${config.user}" ` +
                    `-d "${config.database}" ` +
                    `--no-owner ` +
                    `--no-privileges ` +
                    `--clean ` +
                    `--if-exists ` +
                    `-f "${filePath}"`;
            }
            else {
                command = `PGPASSWORD="${config.password}" pg_dump ` +
                    `-h "${config.host}" ` +
                    `-p "${config.port}" ` +
                    `-U "${config.user}" ` +
                    `-d "${config.database}" ` +
                    `--format=custom ` +
                    `--no-owner ` +
                    `--no-privileges ` +
                    `--compress=9 ` +
                    `-f "${filePath}"`;
            }
            const startTime = Date.now();
            this.logger.log(`Executing backup command...`);
            const { stdout, stderr } = await execAsync(command, {
                env: {
                    ...process.env,
                    PGPASSWORD: config.password
                },
                timeout: 300000,
                maxBuffer: 1024 * 1024 * 50
            });
            if (stderr && !stderr.includes('warning')) {
                this.logger.warn(`pg_dump warnings: ${stderr}`);
            }
            const stats = await fsPromises.stat(filePath);
            const fileSize = (stats.size / (1024 * 1024)).toFixed(2);
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            const fileContent = await fsPromises.readFile(filePath);
            const checksum = crypto.createHash('sha256')
                .update(fileContent)
                .digest('hex')
                .substring(0, 16);
            const tableCountCmd = `PGPASSWORD="${config.password}" psql ` +
                `-h "${config.host}" ` +
                `-p "${config.port}" ` +
                `-U "${config.user}" ` +
                `-d "${config.database}" ` +
                `-t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'"`;
            const { stdout: tableCount } = await execAsync(tableCountCmd);
            const metadata = {
                fileName,
                filePath,
                fileSize: `${fileSize} MB`,
                checksum,
                type,
                tableCount: parseInt(tableCount.trim()),
                duration: `${duration}s`,
                createdAt: new Date().toISOString(),
                databaseUrl: config.database,
                host: config.host,
                method: 'pg_dump'
            };
            const metadataPath = filePath.replace(`.${extension}`, '-metadata.json');
            await fsPromises.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
            this.logger.log(`Backup completed successfully: ${fileName} (${fileSize} MB)`);
            return {
                success: true,
                message: 'Professional backup created successfully',
                metadata
            };
        }
        catch (error) {
            this.logger.error(`Backup failed: ${error.message}`);
            return {
                success: false,
                message: `Backup failed: ${error.message}`,
                error: error.message
            };
        }
    }
    async listBackups() {
        try {
            const files = await fsPromises.readdir(this.backupDir);
            const backups = [];
            for (const file of files) {
                if (file.includes('-metadata.json')) {
                    try {
                        const metadataPath = path.join(this.backupDir, file);
                        const metadata = JSON.parse(await fsPromises.readFile(metadataPath, 'utf-8'));
                        const backupExists = await fsPromises.access(metadata.filePath)
                            .then(() => true)
                            .catch(() => false);
                        if (backupExists) {
                            backups.push(metadata);
                        }
                    }
                    catch (err) {
                        this.logger.warn(`Failed to read metadata for ${file}: ${err.message}`);
                    }
                }
            }
            backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return {
                success: true,
                backups,
                count: backups.length
            };
        }
        catch (error) {
            this.logger.error(`Failed to list backups: ${error.message}`);
            return {
                success: false,
                backups: [],
                error: error.message
            };
        }
    }
    async getBackupFile(fileName) {
        try {
            const filePath = path.join(this.backupDir, fileName);
            if (fileName.includes('..') || fileName.includes('/')) {
                throw new Error('Invalid filename');
            }
            await fsPromises.access(filePath);
            return {
                success: true,
                filePath,
                fileName
            };
        }
        catch (error) {
            this.logger.error(`Failed to get backup file: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }
    async restoreProfessionalBackup(fileName) {
        try {
            this.logger.log(`Starting professional PostgreSQL restore from ${fileName}...`);
            const filePath = path.join(this.backupDir, fileName);
            if (fileName.includes('..') || fileName.includes('/')) {
                throw new Error('Invalid filename');
            }
            await fsPromises.access(filePath);
            const databaseUrl = process.env.DATABASE_URL;
            const urlParts = new URL(databaseUrl);
            const env = {
                ...process.env,
                PGHOST: urlParts.hostname,
                PGPORT: urlParts.port || '5432',
                PGUSER: urlParts.username,
                PGPASSWORD: urlParts.password,
                PGDATABASE: urlParts.pathname.slice(1),
            };
            const startTime = Date.now();
            let restoreCommand;
            if (fileName.endsWith('.sql')) {
                restoreCommand = `psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE --single-transaction --set ON_ERROR_STOP=1 -f "${filePath}"`;
            }
            else if (fileName.endsWith('.dump')) {
                restoreCommand = `pg_restore -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE --jobs=4 --verbose --clean --if-exists --no-owner --no-privileges --disable-triggers "${filePath}"`;
            }
            else {
                throw new Error('Unsupported backup file format');
            }
            this.logger.log(`Executing restore command...`);
            const { stdout, stderr } = await execAsync(restoreCommand, {
                env,
                maxBuffer: 100 * 1024 * 1024,
                timeout: 30 * 60 * 1000,
            });
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            if (stderr) {
                this.logger.warn(`Restore warnings: ${stderr}`);
            }
            const result = {
                success: true,
                fileName,
                duration: `${duration}s`,
                restoredAt: new Date().toISOString(),
                warnings: stderr || null,
            };
            this.logger.log(`Professional restore completed in ${duration}s`);
            return result;
        }
        catch (error) {
            this.logger.error(`Professional restore failed: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }
    async cleanupOldBackups(daysToKeep = 7) {
        try {
            const files = await fsPromises.readdir(this.backupDir);
            const now = Date.now();
            const maxAge = daysToKeep * 24 * 60 * 60 * 1000;
            let deletedCount = 0;
            for (const file of files) {
                const filePath = path.join(this.backupDir, file);
                const stats = await fsPromises.stat(filePath);
                if (now - stats.mtime.getTime() > maxAge) {
                    await fsPromises.unlink(filePath);
                    deletedCount++;
                    this.logger.log(`Deleted old backup: ${file}`);
                }
            }
            return {
                success: true,
                deletedCount,
                message: `Cleaned up ${deletedCount} old backups`
            };
        }
        catch (error) {
            this.logger.error(`Cleanup failed: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }
};
exports.ProfessionalBackupService = ProfessionalBackupService;
exports.ProfessionalBackupService = ProfessionalBackupService = ProfessionalBackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProfessionalBackupService);
//# sourceMappingURL=professional-backup.service.js.map