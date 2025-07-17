import { IsString, IsNumber, IsBoolean, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DimensionsDto {
  @ApiProperty({ description: 'Page width in mm' })
  @IsNumber()
  pageWidth: number;

  @ApiProperty({ description: 'Page height in mm' })
  @IsNumber()
  pageHeight: number;

  @ApiProperty({ description: 'Label width in mm' })
  @IsNumber()
  labelWidth: number;

  @ApiProperty({ description: 'Label height in mm' })
  @IsNumber()
  labelHeight: number;

  @ApiProperty({ description: 'Number of columns' })
  @IsNumber()
  columns: number;

  @ApiProperty({ description: 'Number of rows' })
  @IsNumber()
  rows: number;

  @ApiProperty({ description: 'Top margin in mm' })
  @IsNumber()
  marginTop: number;

  @ApiProperty({ description: 'Left margin in mm' })
  @IsNumber()
  marginLeft: number;

  @ApiProperty({ description: 'Horizontal spacing in mm' })
  @IsNumber()
  spacingX: number;

  @ApiProperty({ description: 'Vertical spacing in mm' })
  @IsNumber()
  spacingY: number;
}

export class CreateMediaTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Template code (e.g., L7160)' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Manufacturer name', required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Template dimensions' })
  @IsObject()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  @ApiProperty({ description: 'Page orientation', enum: ['portrait', 'landscape'] })
  @IsString()
  orientation: 'portrait' | 'landscape';
}

export class UpdateMediaTemplateDto {
  @ApiProperty({ description: 'Template name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Template code', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'Manufacturer name', required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Template dimensions', required: false })
  @IsObject()
  @ValidateNested()
  @Type(() => DimensionsDto)
  @IsOptional()
  dimensions?: Partial<DimensionsDto>;

  @ApiProperty({ description: 'Page orientation', enum: ['portrait', 'landscape'], required: false })
  @IsString()
  @IsOptional()
  orientation?: 'portrait' | 'landscape';

  @ApiProperty({ description: 'Active status', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}