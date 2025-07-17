import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
    };
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    validateToken(token: string): Promise<{
        valid: boolean;
        user: {
            valid: boolean;
            user: {
                id: string;
                email: string;
            };
        };
        error?: undefined;
    } | {
        valid: boolean;
        error: any;
        user?: undefined;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
    updateProfile(req: any, updateData: any): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    getSessions(req: any): Promise<{
        sessions: any[];
    }>;
}
