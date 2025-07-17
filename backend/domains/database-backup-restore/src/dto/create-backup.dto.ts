import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateBackupDto {
  @IsOptional()
  @IsString()
  @IsIn(['manual', 'scheduled', 'emergency'])
  type?: string = 'manual';

  @IsOptional()
  @IsString()
  description?: string;
}