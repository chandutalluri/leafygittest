import { JwtService } from '@nestjs/jwt';
export interface AuthToken {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: {
        id: string;
        email: string;
        role: string;
        branch_id?: string;
        permissions: string[];
    };
}
export interface TokenValidationResult {
    valid: boolean;
    user?: {
        id: string;
        email: string;
        role: string;
        branch_id?: string;
        permissions: string[];
    };
    error?: string;
}
export declare class CentralAuthService {
    private jwtService;
    private db;
    constructor(jwtService: JwtService);
    validateToken(token: string): Promise<TokenValidationResult>;
    authenticateCustomer(email: string, password: string): Promise<AuthToken>;
    authenticateInternalUser(email: string, password: string): Promise<AuthToken>;
    private generateTokens;
    private getUserWithPermissions;
    validatePermission(userId: string, userType: string, permission: string): Promise<boolean>;
    getUserBranchContext(userId: string, userType: string): Promise<string | null>;
}
