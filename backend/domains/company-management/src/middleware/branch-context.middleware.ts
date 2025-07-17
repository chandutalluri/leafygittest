import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

export interface BranchContext {
  branchId: number;
  companyId?: number;
  branchType?: string;
  isDefault?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      branchContext?: BranchContext;
    }
  }
}

@Injectable()
export class BranchContextMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  private readonly exemptPaths = [
    '/health',
    '/api/docs',
    '/companies', // Allow creating companies without branch context
  ];

  use(req: Request, res: Response, next: NextFunction) {
    // Check if this is an exempt endpoint
    if (this.isExemptEndpoint(req.path)) {
      return next();
    }

    // Extract branch context from multiple sources
    const branchId = this.extractBranchContext(req);
    
    // For non-exempt endpoints, branch context is mandatory
    if (!branchId) {
      throw new BadRequestException(
        'Branch context is required. Please provide branch ID via: ' +
        '1) JWT token (preferred), 2) X-Branch-ID header, or 3) branchId query parameter'
      );
    }

    // Set branch context on request
    req.branchContext = { branchId: parseInt(branchId.toString()) };
    
    // Log branch context for debugging
    console.log(`[Branch Context] ${req.method} ${req.path} - Branch ID: ${branchId}`);
    
    next();
  }

  private extractBranchContext(req: Request): number | null {
    // 1. Try to get from JWT token (highest priority)
    const token = this.extractToken(req);
    if (token) {
      try {
        const decoded = this.jwtService.decode(token) as any;
        if (decoded?.branchId) {
          return decoded.branchId;
        }
      } catch (error) {
        // Invalid token, continue to other methods
      }
    }

    // 2. Try to get from header
    const headerBranchId = req.headers['x-branch-id'] || req.headers['X-Branch-ID'];
    if (headerBranchId) {
      return parseInt(headerBranchId.toString());
    }

    // 3. Try to get from query parameter
    const queryBranchId = req.query.branchId;
    if (queryBranchId) {
      return parseInt(queryBranchId.toString());
    }

    // 4. Try to get from request body (for POST/PUT requests)
    if (req.body?.branchId) {
      return parseInt(req.body.branchId.toString());
    }

    return null;
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  private isExemptEndpoint(path: string): boolean {
    return this.exemptPaths.some(exemptPath => 
      path.includes(exemptPath) || path === '/'
    );
  }
}