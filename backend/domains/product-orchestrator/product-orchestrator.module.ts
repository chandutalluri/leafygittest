import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProductOrchestratorController } from './product-orchestrator.controller';
import { ProductOrchestratorService } from './product-orchestrator.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '818072bd26773dd1d2b0ecebebca84e4e8c1f71861bdc803e392656c42007013341eb51af9886d7945ebd7bfa98b53ecdec0a5095f4a753847d5158f71a37e9a',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ProductOrchestratorController],
  providers: [ProductOrchestratorService, JwtAuthGuard],
  exports: [ProductOrchestratorService],
})
export class ProductOrchestratorModule {}