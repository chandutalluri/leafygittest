import { Controller, Post, Get, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RestoreService } from '../services/restore.service';
import { CreateRestoreDto, RestoreStatusDto } from '../dto/restore.dto';

@ApiTags('Restore Management')
@Controller('restore')
export class RestoreController {
  constructor(private readonly restoreService: RestoreService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start restore operation' })
  @ApiResponse({ status: 201, description: 'Restore operation started' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin only' })
  async startRestore(@Body() dto: CreateRestoreDto, @Req() req: any) {
    const createdBy = req.user?.id || 'system';
    const jobId = await this.restoreService.startRestore(dto.backupId, dto.restoreType, createdBy);
    return {
      success: true,
      jobId,
      message: 'Restore operation started',
    };
  }

  @Get('status/:jobId')
  @ApiOperation({ summary: 'Get restore job status' })
  @ApiResponse({ status: 200, description: 'Returns restore job status' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getRestoreStatus(@Param('jobId') jobId: string) {
    const job = await this.restoreService.getRestoreJob(jobId);
    if (!job) {
      throw new Error('Restore job not found');
    }
    return {
      success: true,
      data: job,
    };
  }

  @Get('list')
  @ApiOperation({ summary: 'List restore jobs' })
  @ApiResponse({ status: 200, description: 'Returns list of restore jobs' })
  async getRestoreJobs(@Query() query: RestoreStatusDto) {
    const jobs = await this.restoreService.getRestoreJobs(query.limit);
    return {
      success: true,
      data: jobs,
    };
  }
}