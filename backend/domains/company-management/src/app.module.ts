import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyManagementController } from './controllers/company-management.controller';
import { CompanyManagementService } from './services/company-management.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BranchContextMiddleware } from './middleware/branch-context.middleware';
import { JwtModule } from '@nestjs/jwt';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [CompanyManagementController, HealthController],
  providers: [CompanyManagementService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply branch context middleware to all routes except health and docs
    consumer
      .apply(BranchContextMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET },
        { path: 'api-docs', method: RequestMethod.GET },
        { path: 'company-management/health', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}