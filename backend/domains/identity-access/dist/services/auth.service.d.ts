import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
export declare class AuthService {
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    validateToken(token: string): Promise<{
        valid: boolean;
        user: {
            id: string;
            email: string;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
    updateProfile(userId: string, updateData: any): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    getActiveSessions(userId: string): Promise<{
        sessions: any[];
    }>;
}
