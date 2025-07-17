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
var GCSService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCSService = void 0;
const common_1 = require("@nestjs/common");
let GCSService = GCSService_1 = class GCSService {
    constructor() {
        this.logger = new common_1.Logger(GCSService_1.name);
        this.bucketName = process.env.GCS_BUCKET || 'leafyhealth-backups';
        this.logger.warn('GCS service running in stub mode - cloud storage functionality disabled');
    }
    async uploadBackup(localPath, gcsPath) {
        this.logger.warn(`GCS upload stub called: ${localPath} -> ${gcsPath}`);
        return `local://${localPath}`;
    }
    async isConfigured() {
        return false;
    }
    async downloadBackup(gcsPath, localPath) {
        this.logger.warn(`GCS download stub called: ${gcsPath} -> ${localPath}`);
    }
    async deleteBackup(gcsPath) {
        this.logger.warn(`GCS delete stub called: ${gcsPath}`);
    }
    async listBackups() {
        this.logger.warn('GCS list stub called');
        return [];
    }
    async cleanupOldBackups(retentionDays = 30) {
        this.logger.warn(`GCS cleanup stub called: ${retentionDays} days`);
        return 0;
    }
};
exports.GCSService = GCSService;
exports.GCSService = GCSService = GCSService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GCSService);
//# sourceMappingURL=gcs.service.js.map