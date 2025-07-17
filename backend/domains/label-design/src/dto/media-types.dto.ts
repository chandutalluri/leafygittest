import { IsString, IsNumber, IsBoolean, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PhysicalPropertiesDto {
  @ApiProperty({ description: 'Label width in mm' })
  @IsNumber()
  labelWidth: number;

  @ApiProperty({ description: 'Label height in mm' })
  @IsNumber()
  labelHeight: number;

  @ApiProperty({ description: 'Page width in mm' })
  @IsNumber()
  pageWidth: number;

  @ApiProperty({ description: 'Page height in mm' })
  @IsNumber()
  pageHeight: number;

  @ApiProperty({ description: 'Number of labels per row' })
  @IsNumber()
  labelsPerRow: number;

  @ApiProperty({ description: 'Number of labels per column' })
  @IsNumber()
  labelsPerColumn: number;

  @ApiProperty({ description: 'Total labels per sheet' })
  @IsNumber()
  totalLabelsPerSheet: number;

  @ApiProperty({ description: 'Top margin in mm' })
  @IsNumber()
  marginTop: number;

  @ApiProperty({ description: 'Left margin in mm' })
  @IsNumber()
  marginLeft: number;

  @ApiProperty({ description: 'Right margin in mm' })
  @IsNumber()
  marginRight: number;

  @ApiProperty({ description: 'Bottom margin in mm' })
  @IsNumber()
  marginBottom: number;

  @ApiProperty({ description: 'Horizontal spacing between labels in mm' })
  @IsNumber()
  horizontalSpacing: number;

  @ApiProperty({ description: 'Vertical spacing between labels in mm' })
  @IsNumber()
  verticalSpacing: number;
}

export class CreateMediaTypeDto {
  @ApiProperty({ description: 'Media type name (e.g., "Avery 5160")' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Manufacturer name (e.g., "Avery")' })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: 'Product code (e.g., "5160", "L7160")' })
  @IsString()
  productCode: string;

  @ApiProperty({ description: 'Description of the media type' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Physical properties and dimensions' })
  @IsObject()
  @ValidateNested()
  @Type(() => PhysicalPropertiesDto)
  physicalProperties: PhysicalPropertiesDto;

  @ApiProperty({ description: 'Media type', enum: ['sheet', 'roll'], default: 'sheet' })
  @IsString()
  @IsOptional()
  mediaType?: 'sheet' | 'roll';

  @ApiProperty({ description: 'Page orientation', enum: ['portrait', 'landscape'], default: 'portrait' })
  @IsString()
  @IsOptional()
  orientation?: 'portrait' | 'landscape';
}

export class UpdateMediaTypeDto {
  @ApiProperty({ description: 'Media type name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Manufacturer name', required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: 'Product code', required: false })
  @IsString()
  @IsOptional()
  productCode?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Physical properties and dimensions', required: false })
  @IsObject()
  @ValidateNested()
  @Type(() => PhysicalPropertiesDto)
  @IsOptional()
  physicalProperties?: Partial<PhysicalPropertiesDto>;

  @ApiProperty({ description: 'Media type', enum: ['sheet', 'roll'], required: false })
  @IsString()
  @IsOptional()
  mediaType?: 'sheet' | 'roll';

  @ApiProperty({ description: 'Page orientation', enum: ['portrait', 'landscape'], required: false })
  @IsString()
  @IsOptional()
  orientation?: 'portrait' | 'landscape';

  @ApiProperty({ description: 'Active status', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}