import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class AuthService {
  async validateUser(email: string, password: string): Promise<any> {
    return { id: '1', email, role: 'user' };
  }

  async login(user: any) {
    return {
      access_token: 'mock-jwt-token',
      user
    };
  }

  async register(registerDto: RegisterDto) {
    return {
      message: 'User registered successfully',
      user: { id: '1', email: registerDto.email }
    };
  }

  async logout(userId: string) {
    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshToken: string) {
    return { access_token: 'new-jwt-token' };
  }

  async validateToken(token: string) {
    return { valid: true, user: { id: '1', email: 'user@example.com' } };
  }

  async forgotPassword(email: string) {
    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return { message: 'Password reset successfully' };
  }

  async getProfile(userId: string) {
    return { id: userId, email: 'user@example.com', role: 'user' };
  }

  async updateProfile(userId: string, updateData: any) {
    return { message: 'Profile updated successfully' };
  }

  async verifyEmail(token: string) {
    return { message: 'Email verified successfully' };
  }

  async getActiveSessions(userId: string) {
    return { sessions: [] };
  }
}