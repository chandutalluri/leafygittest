import { IsString, IsOptional } from 'class-validator';

export class RestoreBackupDto {
  @IsString()
  backupJobId: string;

  @IsOptional()
  @IsString()
  targetDatabase?: string = 'current';
}