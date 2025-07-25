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
const customer_controller_1 = require("./controllers/customer.controller");
const customer_address_controller_1 = require("./controllers/customer-address.controller");
const health_controller_1 = require("./controllers/health.controller");
const customer_service_1 = require("./services/customer.service");
const customer_address_service_1 = require("./services/customer-address.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_1.SharedAuthModule],
        controllers: [
            customer_controller_1.CustomerController,
            customer_address_controller_1.CustomerAddressController,
            health_controller_1.HealthController
        ],
        providers: [
            customer_service_1.CustomerService,
            customer_address_service_1.CustomerAddressService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map