"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
let AuthService = class AuthService {
    async validateUser(email, password) {
        return { id: '1', email, role: 'user' };
    }
    async login(user) {
        return {
            access_token: 'mock-jwt-token',
            user
        };
    }
    async register(registerDto) {
        return {
            message: 'User registered successfully',
            user: { id: '1', email: registerDto.email }
        };
    }
    async logout(userId) {
        return { message: 'Logged out successfully' };
    }
    async refreshToken(refreshToken) {
        return { access_token: 'new-jwt-token' };
    }
    async validateToken(token) {
        return { valid: true, user: { id: '1', email: 'user@example.com' } };
    }
    async forgotPassword(email) {
        return { message: 'Password reset email sent' };
    }
    async resetPassword(resetPasswordDto) {
        return { message: 'Password reset successfully' };
    }
    async getProfile(userId) {
        return { id: userId, email: 'user@example.com', role: 'user' };
    }
    async updateProfile(userId, updateData) {
        return { message: 'Profile updated successfully' };
    }
    async verifyEmail(token) {
        return { message: 'Email verified successfully' };
    }
    async getActiveSessions(userId) {
        return { sessions: [] };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map