import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SchedulerService } from '../services/scheduler.service';
import { CreateScheduleDto, UpdateScheduleDto, ScheduleStatusDto } from '../dto/schedule.dto';

@ApiTags('Schedule Management')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create backup schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin only' })
  async createSchedule(@Body() dto: CreateScheduleDto, @Req() req: any) {
    const createdBy = req.user?.id || 'system';
    const schedule = await this.schedulerService.createSchedule(dto, createdBy);
    return {
      success: true,
      data: schedule,
      message: 'Backup schedule created successfully',
    };
  }

  @Get('list')
  @ApiOperation({ summary: 'List backup schedules' })
  @ApiResponse({ status: 200, description: 'Returns list of backup schedules' })
  async getSchedules(@Query() query: ScheduleStatusDto) {
    const schedules = await this.schedulerService.getSchedules(query.limit, query.active);
    return {
      success: true,
      data: schedules,
    };
  }

  @Get(':scheduleId')
  @ApiOperation({ summary: 'Get specific backup schedule' })
  @ApiResponse({ status: 200, description: 'Returns backup schedule details' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  async getSchedule(@Param('scheduleId') scheduleId: string) {
    const schedule = await this.schedulerService.getSchedule(parseInt(scheduleId));
    if (!schedule) {
      throw new Error('Backup schedule not found');
    }
    return {
      success: true,
      data: schedule,
    };
  }

  @Put(':scheduleId')
  @ApiOperation({ summary: 'Update backup schedule' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  async updateSchedule(
    @Param('scheduleId') scheduleId: string,
    @Body() dto: UpdateScheduleDto,
    @Req() req: any
  ) {
    const updatedBy = req.user?.id || 'system';
    const schedule = await this.schedulerService.updateSchedule(parseInt(scheduleId), dto, updatedBy);
    return {
      success: true,
      data: schedule,
      message: 'Backup schedule updated successfully',
    };
  }

  @Delete(':scheduleId')
  @ApiOperation({ summary: 'Delete backup schedule' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  async deleteSchedule(@Param('scheduleId') scheduleId: string, @Req() req: any) {
    const deletedBy = req.user?.id || 'system';
    await this.schedulerService.deleteSchedule(parseInt(scheduleId), deletedBy);
    return {
      success: true,
      message: 'Backup schedule deleted successfully',
    };
  }

  @Post(':scheduleId/toggle')
  @ApiOperation({ summary: 'Toggle schedule active status' })
  @ApiResponse({ status: 200, description: 'Schedule status toggled successfully' })
  async toggleSchedule(@Param('scheduleId') scheduleId: string, @Req() req: any) {
    const updatedBy = req.user?.id || 'system';
    const schedule = await this.schedulerService.toggleSchedule(parseInt(scheduleId), updatedBy);
    return {
      success: true,
      data: schedule,
      message: `Schedule ${schedule.is_active ? 'activated' : 'deactivated'} successfully`,
    };
  }
}