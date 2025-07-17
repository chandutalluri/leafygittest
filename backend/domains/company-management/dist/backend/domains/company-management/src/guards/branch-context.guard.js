"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchContextGuard = void 0;
const common_1 = require("@nestjs/common");
let BranchContextGuard = class BranchContextGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (!request.branchContext || !request.branchContext.branchId) {
            throw new common_1.BadRequestException('Branch context is required for this operation. ' +
                'Please provide branch ID via JWT token, X-Branch-ID header, or branchId query parameter.');
        }
        const branchId = request.branchContext.branchId;
        if (isNaN(branchId) || branchId <= 0) {
            throw new common_1.BadRequestException('Invalid branch ID provided');
        }
        return true;
    }
};
exports.BranchContextGuard = BranchContextGuard;
exports.BranchContextGuard = BranchContextGuard = __decorate([
    (0, common_1.Injectable)()
], BranchContextGuard);
//# sourceMappingURL=branch-context.guard.js.map