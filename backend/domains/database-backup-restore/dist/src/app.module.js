"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const backup_controller_1 = require("./controllers/backup.controller");
const restore_controller_1 = require("./controllers/restore.controller");
const schedule_controller_1 = require("./controllers/schedule.controller");
const health_controller_1 = require("./controllers/health.controller");
const backup_service_1 = require("./services/backup.service");
const restore_service_1 = require("./services/restore.service");
const gcs_service_1 = require("./services/gcs.service");
const scheduler_service_1 = require("./services/scheduler.service");
const quick_backup_service_1 = require("./services/quick-backup.service");
const safe_backup_service_1 = require("./services/safe-backup.service");
const professional_backup_service_1 = require("./services/professional-backup.service");
const superadmin_guard_1 = require("./guards/superadmin.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [
            health_controller_1.HealthController,
            backup_controller_1.BackupController,
            restore_controller_1.RestoreController,
            schedule_controller_1.ScheduleController,
        ],
        providers: [
            backup_service_1.BackupService,
            restore_service_1.RestoreService,
            gcs_service_1.GCSService,
            scheduler_service_1.SchedulerService,
            quick_backup_service_1.QuickBackupService,
            safe_backup_service_1.SafeBackupService,
            professional_backup_service_1.ProfessionalBackupService,
            superadmin_guard_1.SuperAdminGuard,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map