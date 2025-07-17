import { IsString, IsOptional, IsNumber } from 'class-validator';

export class BackupStatusDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  limit?: number = 50;
}

export class CreateScheduleDto {
  @IsString()
  name: string;

  @IsString()
  cronExpression: string;

  @IsOptional()
  @IsString()
  backupType?: string = 'scheduled';
}

export class UpdateScheduleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  cronExpression?: string;

  @IsOptional()
  @IsString()
  backupType?: string;

  @IsOptional()
  isActive?: boolean;
}