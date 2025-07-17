import { createParamDecorator, ExecutionContext, applyDecorators, UseGuards } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { BranchContextGuard } from '../guards/branch-context.guard';

/**
 * Extract branch context from the request
 */
export const BranchContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.branchContext;
  },
);

/**
 * Decorator to mark endpoints that require branch context
 */
export const RequireBranch = () => {
  return applyDecorators(
    UseGuards(BranchContextGuard),
    ApiHeader({
      name: 'X-Branch-ID',
      description: 'Branch context for the request. Can also be provided via JWT token or query parameter.',
      required: false,
      example: '1',
    }),
  );
};

/**
 * Get the current branch ID from the request
 */
export const CurrentBranchId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.branchContext?.branchId;
  },
);

/**
 * Get the current company ID from the branch context
 */
export const CurrentCompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.branchContext?.companyId;
  },
);