import { Module } from '@nestjs/common';
// import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { BackupController } from './controllers/backup.controller';
import { RestoreController } from './controllers/restore.controller';
import { ScheduleController } from './controllers/schedule.controller';
import { HealthController } from './controllers/health.controller';
import { BackupService } from './services/backup.service';
import { RestoreService } from './services/restore.service';
import { GCSService } from './services/gcs.service';
import { SchedulerService } from './services/scheduler.service';
import { QuickBackupService } from './services/quick-backup.service';
import { SafeBackupService } from './services/safe-backup.service';
import { ProfessionalBackupService } from './services/professional-backup.service';
import { SuperAdminGuard } from './guards/superadmin.guard';

@Module({
  imports: [
    // ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [
    HealthController,
    BackupController,
    RestoreController,
    ScheduleController,
  ],
  providers: [
    BackupService,
    RestoreService,
    GCSService,
    SchedulerService,
    QuickBackupService,
    SafeBackupService,
    ProfessionalBackupService,
    SuperAdminGuard,
  ],
})
export class AppModule {}