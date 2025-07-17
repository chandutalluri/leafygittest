"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentCompanyId = exports.CurrentBranchId = exports.RequireBranch = exports.BranchContext = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const branch_context_guard_1 = require("../guards/branch-context.guard");
exports.BranchContext = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.branchContext;
});
const RequireBranch = () => {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(branch_context_guard_1.BranchContextGuard), (0, swagger_1.ApiHeader)({
        name: 'X-Branch-ID',
        description: 'Branch context for the request. Can also be provided via JWT token or query parameter.',
        required: false,
        example: '1',
    }));
};
exports.RequireBranch = RequireBranch;
exports.CurrentBranchId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.branchContext?.branchId;
});
exports.CurrentCompanyId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.branchContext?.companyId;
});
//# sourceMappingURL=branch-context.decorator.js.map