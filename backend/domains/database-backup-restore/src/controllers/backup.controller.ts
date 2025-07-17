import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards, Req, Res, StreamableFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { BackupService } from '../services/backup.service';
import { SchedulerService } from '../services/scheduler.service';
import { QuickBackupService } from '../services/quick-backup.service';
import { SafeBackupService } from '../services/safe-backup.service';
import { ProfessionalBackupService } from '../services/professional-backup.service';
import * as fs from 'fs';
import { CreateBackupDto } from '../dto/create-backup.dto';
import { BackupStatusDto } from '../dto/backup-status.dto';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';
import { SuperAdminGuard } from '../guards/superadmin.guard';

@ApiTags('Backup Management')
@Controller('backup')
export class BackupController {
  constructor(
    private readonly backupService: BackupService,
    private readonly schedulerService: SchedulerService,
    private readonly quickBackupService: QuickBackupService,
    private readonly safeBackupService: SafeBackupService,
    private readonly professionalBackupService: ProfessionalBackupService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new backup' })
  @ApiResponse({ status: 201, description: 'Backup created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin only' })
  async createBackup(@Body() dto: CreateBackupDto, @Req() req: any) {
    const createdBy = req.user?.id || 'system';
    const jobId = await this.backupService.createBackup(dto.type, createdBy);
    return {
      success: true,
      jobId,
      message: 'Backup job started',
    };
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Get backup jobs' })
  @ApiResponse({ status: 200, description: 'Returns list of backup jobs' })
  async getBackupJobs(@Query() query: BackupStatusDto) {
    const jobs = await this.backupService.getBackupJobs(query.limit);
    return {
      success: true,
      data: jobs,
    };
  }

  @Get('jobs/:jobId')
  @ApiOperation({ summary: 'Get specific backup job' })
  @ApiResponse({ status: 200, description: 'Returns backup job details' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getBackupJob(@Param('jobId') jobId: string) {
    const job = await this.backupService.getBackupJob(jobId);
    if (!job) {
      throw new Error('Backup job not found');
    }
    return {
      success: true,
      data: job,
    };
  }

  @Delete('jobs/:jobId')
  @ApiOperation({ summary: 'Delete a backup' })
  @ApiResponse({ status: 200, description: 'Backup deleted successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async deleteBackup(@Param('jobId') jobId: string) {
    await this.backupService.deleteBackup(jobId);
    return {
      success: true,
      message: 'Backup deleted successfully',
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get backup statistics' })
  @ApiResponse({ status: 200, description: 'Returns backup statistics' })
  async getBackupStats() {
    const stats = await this.backupService.getBackupStats();
    return {
      success: true,
      data: stats,
    };
  }

  // Schedule Management
  @Post('schedules')
  @ApiOperation({ summary: 'Create backup schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  async createSchedule(@Body() dto: CreateScheduleDto) {
    const schedule = await this.schedulerService.createSchedule(dto, 'admin@leafyhealth.com');
    return {
      success: true,
      data: schedule,
    };
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Get all backup schedules' })
  @ApiResponse({ status: 200, description: 'Returns list of schedules' })
  async getSchedules() {
    const schedules = await this.schedulerService.getSchedules();
    return {
      success: true,
      data: schedules,
    };
  }

  @Post('schedules/:id')
  @ApiOperation({ summary: 'Update backup schedule' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  async updateSchedule(@Param('id') id: number, @Body() dto: UpdateScheduleDto) {
    const schedule = await this.schedulerService.updateSchedule(id, dto, 'admin@leafyhealth.com');
    return {
      success: true,
      data: schedule,
    };
  }

  @Delete('schedules/:id')
  @ApiOperation({ summary: 'Delete backup schedule' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  async deleteSchedule(@Param('id') id: number) {
    await this.schedulerService.deleteSchedule(id, 'admin@leafyhealth.com');
    return {
      success: true,
      message: 'Schedule deleted successfully',
    };
  }

  @Post('quick')
  @ApiOperation({ summary: 'Create a quick data-only backup' })
  @ApiResponse({ status: 200, description: 'Quick backup created successfully' })
  async createQuickBackup() {
    return await this.quickBackupService.createQuickBackup();
  }

  @Post('export')
  @ApiOperation({ summary: 'Export critical data as JSON' })
  @ApiResponse({ status: 200, description: 'Data exported successfully' })
  async createJsonExport() {
    return await this.quickBackupService.createJsonExport();
  }

  @Post('safe-backup')
  @ApiOperation({ summary: 'Create a safe JSON backup that avoids connection pool issues' })
  async createSafeBackup() {
    return this.safeBackupService.createSafeBackup();
  }

  @Get('safe-backup/list')
  @ApiOperation({ summary: 'List available safe backups' })
  async listSafeBackups() {
    return this.safeBackupService.listBackups();
  }

  @Delete('safe-backup/:fileName')
  @ApiOperation({ summary: 'Delete a safe backup' })
  async deleteSafeBackup(@Param('fileName') fileName: string) {
    const success = await this.safeBackupService.deleteBackup(fileName);
    return { success, message: success ? 'Backup deleted' : 'Failed to delete backup' };
  }

  @Post('professional')
  @ApiOperation({ summary: 'Create a professional PostgreSQL backup using pg_dump' })
  @ApiResponse({ status: 200, description: 'Professional backup created successfully' })
  async createProfessionalBackup(@Body() dto: { type?: 'logical' | 'custom' }) {
    return await this.professionalBackupService.createProfessionalBackup(dto.type || 'custom');
  }

  @Get('professional/list')
  @ApiOperation({ summary: 'List all professional backups' })
  @ApiResponse({ status: 200, description: 'Returns list of professional backups' })
  async listProfessionalBackups() {
    return await this.professionalBackupService.listBackups();
  }

  @Get('professional/download/:fileName')
  @ApiOperation({ summary: 'Download a professional backup file' })
  @ApiResponse({ status: 200, description: 'Returns backup file for download' })
  async downloadProfessionalBackup(@Param('fileName') fileName: string, @Res() res: Response) {
    const result = await this.professionalBackupService.getBackupFile(fileName);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    const file = fs.createReadStream(result.filePath);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${result.fileName}"`,
    });
    
    file.pipe(res);
  }

  @Post('professional/restore')
  @ApiOperation({ summary: 'Restore database from professional backup' })
  @ApiBody({ schema: { properties: { fileName: { type: 'string', description: 'Backup file name to restore from' } } } })
  async restoreProfessionalBackup(@Body() body: { fileName: string }) {
    return await this.professionalBackupService.restoreProfessionalBackup(body.fileName);
  }

  @Delete('professional/cleanup')
  @ApiOperation({ summary: 'Cleanup old professional backups' })
  @ApiResponse({ status: 200, description: 'Old backups cleaned up successfully' })
  async cleanupProfessionalBackups(@Query('days') days?: number) {
    return await this.professionalBackupService.cleanupOldBackups(days || 7);
  }
}