import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || '818072bd26773dd1d2b0ecebebca84e4e8c1f71861bdc803e392656c42007013341eb51af9886d7945ebd7bfa98b53ecdec0a5095f4a753847d5158f71a37e9a'
      });
      
      // Attach user info to request
      request['user'] = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: payload.name
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers?.authorization || request.headers?.Authorization;
    if (!authHeader) return undefined;
    
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}