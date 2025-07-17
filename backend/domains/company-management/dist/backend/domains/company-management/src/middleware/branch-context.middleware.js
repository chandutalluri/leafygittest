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
exports.BranchContextMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let BranchContextMiddleware = class BranchContextMiddleware {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.exemptPaths = [
            '/health',
            '/api/docs',
            '/companies',
        ];
    }
    use(req, res, next) {
        if (this.isExemptEndpoint(req.path)) {
            return next();
        }
        const branchId = this.extractBranchContext(req);
        if (!branchId) {
            throw new common_1.BadRequestException('Branch context is required. Please provide branch ID via: ' +
                '1) JWT token (preferred), 2) X-Branch-ID header, or 3) branchId query parameter');
        }
        req.branchContext = { branchId: parseInt(branchId.toString()) };
        console.log(`[Branch Context] ${req.method} ${req.path} - Branch ID: ${branchId}`);
        next();
    }
    extractBranchContext(req) {
        const token = this.extractToken(req);
        if (token) {
            try {
                const decoded = this.jwtService.decode(token);
                if (decoded?.branchId) {
                    return decoded.branchId;
                }
            }
            catch (error) {
            }
        }
        const headerBranchId = req.headers['x-branch-id'] || req.headers['X-Branch-ID'];
        if (headerBranchId) {
            return parseInt(headerBranchId.toString());
        }
        const queryBranchId = req.query.branchId;
        if (queryBranchId) {
            return parseInt(queryBranchId.toString());
        }
        if (req.body?.branchId) {
            return parseInt(req.body.branchId.toString());
        }
        return null;
    }
    extractToken(req) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return null;
    }
    isExemptEndpoint(path) {
        return this.exemptPaths.some(exemptPath => path.includes(exemptPath) || path === '/');
    }
};
exports.BranchContextMiddleware = BranchContextMiddleware;
exports.BranchContextMiddleware = BranchContextMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], BranchContextMiddleware);
//# sourceMappingURL=branch-context.middleware.js.map