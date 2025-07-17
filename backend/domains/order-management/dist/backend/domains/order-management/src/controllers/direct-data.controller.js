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
exports.DirectDataController = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let DirectDataController = class DirectDataController {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }
    async getOrders() {
        try {
            const result = await this.pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50');
            return result.rows;
        }
        catch (error) {
            return [];
        }
    }
    async getProducts() {
        try {
            const result = await this.pool.query('SELECT * FROM products ORDER BY created_at DESC LIMIT 100');
            return result.rows;
        }
        catch (error) {
            return [];
        }
    }
    async getInventory() {
        try {
            const result = await this.pool.query('SELECT * FROM inventory ORDER BY created_at DESC LIMIT 100');
            return result.rows;
        }
        catch (error) {
            return [];
        }
    }
};
exports.DirectDataController = DirectDataController;
__decorate([
    (0, common_1.Get)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DirectDataController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DirectDataController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('inventory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DirectDataController.prototype, "getInventory", null);
exports.DirectDataController = DirectDataController = __decorate([
    (0, common_1.Controller)('direct-data'),
    __metadata("design:paramtypes", [])
], DirectDataController);
//# sourceMappingURL=direct-data.controller.js.map