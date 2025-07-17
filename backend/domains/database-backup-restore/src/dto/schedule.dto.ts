import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, Min, Max, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BackupType {
  FULL = 'full',
  SCHEMA_ONLY = 'schema_only',
  DATA_ONLY = 'data_only',
  CUSTOM = 'custom'
}

export class CreateScheduleDto {
  @ApiProperty({ description: 'Schedule name' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Cron expression for schedule timing',
    example: '0 2 * * *' // Daily at 2 AM
  })
  @IsString()
  @Matches(/^(\*|[0-5]?\d) (\*|1?\d|2[0-3]) (\*|[12]?\d|3[01]) (\*|[1-9]|1[012]) (\*|[0-6])$/, {
    message: 'Invalid cron expression format'
  })
  cronExpression: string;

  @ApiProperty({ 
    description: 'Type of backup to perform',
    enum: BackupType,
    default: BackupType.FULL
  })
  @IsEnum(BackupType)
  @IsOptional()
  backupType?: BackupType = BackupType.FULL;

  @ApiProperty({ description: 'Number of days to retain backups', default: 30 })
  @IsNumber()
  @Min(1)
  @Max(365)
  @IsOptional()
  retentionDays?: number = 30;

  @ApiProperty({ description: 'Whether schedule is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ description: 'Custom tables to backup (for custom backup type)', required: false })
  @IsOptional()
  customTables?: string[];
}

export class UpdateScheduleDto {
  @ApiProperty({ description: 'Schedule name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    description: 'Cron expression for schedule timing',
    example: '0 2 * * *',
    required: false
  })
  @IsString()
  @Matches(/^(\*|[0-5]?\d) (\*|1?\d|2[0-3]) (\*|[12]?\d|3[01]) (\*|[1-9]|1[012]) (\*|[0-6])$/, {
    message: 'Invalid cron expression format'
  })
  @IsOptional()
  cronExpression?: string;

  @ApiProperty({ 
    description: 'Type of backup to perform',
    enum: BackupType,
    required: false
  })
  @IsEnum(BackupType)
  @IsOptional()
  backupType?: BackupType;

  @ApiProperty({ description: 'Number of days to retain backups', required: false })
  @IsNumber()
  @Min(1)
  @Max(365)
  @IsOptional()
  retentionDays?: number;

  @ApiProperty({ description: 'Whether schedule is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Custom tables to backup (for custom backup type)', required: false })
  @IsOptional()
  customTables?: string[];
}

export class ScheduleStatusDto {
  @ApiProperty({ description: 'Limit number of results', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}