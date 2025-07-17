"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CentralAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const pg_1 = require("pg");
let CentralAuthService = class CentralAuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.db = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }
    async validateToken(token) {
        try {
            if (!token) {
                return { valid: false, error: 'No token provided' };
            }
            const cleanToken = token.replace('Bearer ', '');
            const payload = this.jwtService.verify(cleanToken);
            const user = await this.getUserWithPermissions(payload.sub, payload.userType);
            if (!user) {
                return { valid: false, error: 'User not found' };
            }
            return {
                valid: true,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    branch_id: user.branch_id,
                    permissions: user.permissions,
                },
            };
        }
        catch (error) {
            return {
                valid: false,
                error: error.message || 'Invalid token'
            };
        }
    }
    async authenticateCustomer(email, password) {
        const result = await this.db.query(`
      SELECT u.*, c.branch_id 
      FROM auth.users u
      LEFT JOIN customers.customers c ON u.id = c.user_id
      WHERE u.email = $1 AND u.is_verified = true
    `, [email]);
        if (result.rows.length === 0) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const user = result.rows[0];
        if (!await bcrypt.compare(password, user.password_hash)) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const permissions = ['order:create', 'order:read', 'cart:manage', 'profile:manage'];
        return this.generateTokens(user.id, 'customer', permissions, user.branch_id);
    }
    async authenticateInternalUser(email, password) {
        const result = await this.db.query(`
      SELECT iu.*, 
             ARRAY_AGG(DISTINCT p.name) as permissions
      FROM auth.internal_users iu
      LEFT JOIN auth.user_roles ur ON iu.id = ur.user_id
      LEFT JOIN auth.roles r ON ur.role_id = r.id
      LEFT JOIN auth.role_permissions rp ON r.id = rp.role_id
      LEFT JOIN auth.permissions p ON rp.permission_id = p.id
      WHERE iu.email = $1 AND iu.is_active = true
      GROUP BY iu.id
    `, [email]);
        if (result.rows.length === 0) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const internalUser = result.rows[0];
        if (!await bcrypt.compare(password, internalUser.password_hash)) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const permissions = internalUser.permissions || [];
        return this.generateTokens(internalUser.id, internalUser.role, permissions, internalUser.branch_id);
    }
    generateTokens(userId, userType, permissions, branchId) {
        const payload = {
            sub: userId,
            userType,
            permissions,
            branch_id: branchId,
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign({ sub: userId, userType, type: 'refresh' }, { expiresIn: '7d' });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: 900,
            user: {
                id: userId,
                email: '',
                role: userType,
                branch_id: branchId,
                permissions,
            },
        };
    }
    async getUserWithPermissions(userId, userType) {
        if (userType === 'customer') {
            const result = await this.db.query(`
        SELECT u.*, c.branch_id 
        FROM auth.users u
        LEFT JOIN customers.customers c ON u.id = c.user_id
        WHERE u.id = $1
      `, [userId]);
            const user = result.rows[0];
            return user ? {
                id: user.id,
                email: user.email,
                role: 'customer',
                branch_id: user.branch_id,
                permissions: ['order:create', 'order:read', 'cart:manage', 'profile:manage'],
            } : null;
        }
        else {
            const result = await this.db.query(`
        SELECT iu.*, 
               ARRAY_AGG(DISTINCT p.name) as permissions
        FROM auth.internal_users iu
        LEFT JOIN auth.user_roles ur ON iu.id = ur.user_id
        LEFT JOIN auth.roles r ON ur.role_id = r.id
        LEFT JOIN auth.role_permissions rp ON r.id = rp.role_id
        LEFT JOIN auth.permissions p ON rp.permission_id = p.id
        WHERE iu.id = $1
        GROUP BY iu.id
      `, [userId]);
            const internalUser = result.rows[0];
            if (!internalUser)
                return null;
            return {
                id: internalUser.id,
                email: internalUser.email,
                role: internalUser.role,
                branch_id: internalUser.branch_id,
                permissions: internalUser.permissions || [],
            };
        }
    }
    async validatePermission(userId, userType, permission) {
        const user = await this.getUserWithPermissions(userId, userType);
        return user ? user.permissions.includes(permission) : false;
    }
    async getUserBranchContext(userId, userType) {
        const user = await this.getUserWithPermissions(userId, userType);
        return user ? user.branch_id : null;
    }
};
exports.CentralAuthService = CentralAuthService;
exports.CentralAuthService = CentralAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], CentralAuthService);
//# sourceMappingURL=central-auth.service.js.map