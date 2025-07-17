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
const config_1 = require("@nestjs/config");
const company_management_controller_1 = require("./controllers/company-management.controller");
const company_management_service_1 = require("./services/company-management.service");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const branch_context_middleware_1 = require("./middleware/branch-context.middleware");
const jwt_1 = require("@nestjs/jwt");
const health_controller_1 = require("./health.controller");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(branch_context_middleware_1.BranchContextMiddleware)
            .exclude({ path: 'health', method: common_1.RequestMethod.GET }, { path: 'api-docs', method: common_1.RequestMethod.GET }, { path: 'company-management/health', method: common_1.RequestMethod.GET })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [company_management_controller_1.CompanyManagementController, health_controller_1.HealthController],
        providers: [company_management_service_1.CompanyManagementService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map