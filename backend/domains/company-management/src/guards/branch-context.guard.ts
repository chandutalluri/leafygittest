import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BranchContextGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check if branch context exists
    if (!request.branchContext || !request.branchContext.branchId) {
      throw new BadRequestException(
        'Branch context is required for this operation. ' +
        'Please provide branch ID via JWT token, X-Branch-ID header, or branchId query parameter.'
      );
    }
    
    // Validate branch ID is a valid number
    const branchId = request.branchContext.branchId;
    if (isNaN(branchId) || branchId <= 0) {
      throw new BadRequestException('Invalid branch ID provided');
    }
    
    return true;
  }
}