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
const auth_1 = require("../../../../shared/auth");
const config_1 = require("@nestjs/config");
const label_controller_1 = require("./controllers/label.controller");
const template_controller_1 = require("./controllers/template.controller");
const custom_template_controller_1 = require("./controllers/custom-template.controller");
const barcode_controller_1 = require("./controllers/barcode.controller");
const print_controller_1 = require("./controllers/print.controller");
const compliance_controller_1 = require("./controllers/compliance.controller");
const health_controller_1 = require("./controllers/health.controller");
const media_template_controller_1 = require("./controllers/media-template.controller");
const media_types_controller_1 = require("./controllers/media-types.controller");
const minimal_template_controller_1 = require("./controllers/minimal-template.controller");
const design_template_controller_1 = require("./controllers/design-template.controller");
const label_service_1 = require("./services/label.service");
const template_service_1 = require("./services/template.service");
const custom_template_service_1 = require("./services/custom-template.service");
const barcode_service_1 = require("./services/barcode.service");
const print_service_1 = require("./services/print.service");
const compliance_service_1 = require("./services/compliance.service");
const media_template_service_1 = require("./services/media-template.service");
const minimal_template_service_1 = require("./services/minimal-template.service");
const media_types_service_1 = require("./services/media-types.service");
const design_template_service_1 = require("./services/design-template.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_1.SharedAuthModule, config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),],
        controllers: [
            label_controller_1.LabelController,
            template_controller_1.TemplateController,
            custom_template_controller_1.CustomTemplateController,
            barcode_controller_1.BarcodeController,
            print_controller_1.PrintController,
            compliance_controller_1.ComplianceController,
            health_controller_1.HealthController,
            media_template_controller_1.MediaTemplateController,
            media_types_controller_1.MediaTypesController,
            minimal_template_controller_1.MinimalTemplateController,
            design_template_controller_1.DesignTemplateController,
        ],
        providers: [
            label_service_1.LabelService,
            template_service_1.TemplateService,
            custom_template_service_1.CustomTemplateService,
            barcode_service_1.BarcodeService,
            print_service_1.PrintService,
            compliance_service_1.ComplianceService,
            media_template_service_1.MediaTemplateService,
            minimal_template_service_1.MinimalTemplateService,
            media_types_service_1.MediaTypesService,
            design_template_service_1.DesignTemplateService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map