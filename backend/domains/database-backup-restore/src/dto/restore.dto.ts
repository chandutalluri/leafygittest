import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RestoreType {
  FULL = 'full',
  SCHEMA_ONLY = 'schema_only',
  DATA_ONLY = 'data_only',
  CUSTOM = 'custom'
}

export class CreateRestoreDto {
  @ApiProperty({ description: 'Backup ID to restore from' })
  @IsNumber()
  backupId: number;

  @ApiProperty({ 
    description: 'Type of restore operation',
    enum: RestoreType,
    default: RestoreType.FULL
  })
  @IsEnum(RestoreType)
  @IsOptional()
  restoreType?: RestoreType = RestoreType.FULL;

  @ApiProperty({ description: 'Custom tables to restore (for custom restore type)', required: false })
  @IsOptional()
  customTables?: string[];

  @ApiProperty({ description: 'Whether to drop existing data before restore', default: false })
  @IsOptional()
  dropExisting?: boolean = false;
}

export class RestoreStatusDto {
  @ApiProperty({ description: 'Limit number of results', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @ApiProperty({ description: 'Filter by status', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}