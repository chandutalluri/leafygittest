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
const order_controller_1 = require("./controllers/order.controller");
const health_controller_1 = require("./controllers/health.controller");
const direct_data_controller_1 = require("./controllers/direct-data.controller");
const order_service_1 = require("./services/order.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_1.SharedAuthModule],
        controllers: [order_controller_1.OrderController, health_controller_1.HealthController, direct_data_controller_1.DirectDataController],
        providers: [order_service_1.OrderService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map