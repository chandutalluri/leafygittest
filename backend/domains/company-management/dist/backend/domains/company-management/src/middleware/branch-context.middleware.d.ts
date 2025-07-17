import { NestMiddleware } from '@nestjs/common';
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
export declare class BranchContextMiddleware implements NestMiddleware {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    private readonly exemptPaths;
    use(req: Request, res: Response, next: NextFunction): void;
    private extractBranchContext;
    private extractToken;
    private isExemptEndpoint;
}
