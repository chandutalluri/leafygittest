import { IsString, IsNumber, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum PrintFormat {
  PDF = 'pdf',
  ZPL = 'zpl',
  PNG = 'png'
}

export class PrintLabelDto {
  @IsNumber()
  templateId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsString()
  format: string; // pdf, zpl, png

  @IsNumber()
  mediaId: number;

  @IsNumber()
  branchId: number;

  @IsOptional()
  @IsString()
  printerName?: string;

  @IsOptional()
  @IsString()
  serialStart?: string;

  @IsOptional()
  @IsString()
  serialEnd?: string;

  @IsOptional()
  @IsString()
  batchId?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class CreateCustomTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  paperSize: string;

  @IsNumber()
  paperWidth: number;

  @IsNumber()
  paperHeight: number;

  @IsNumber()
  labelWidth: number;

  @IsNumber()
  labelHeight: number;

  @IsNumber()
  horizontalCount: number;

  @IsNumber()
  verticalCount: number;

  @IsNumber()
  marginTop: number;

  @IsNumber()
  marginBottom: number;

  @IsNumber()
  marginLeft: number;

  @IsNumber()
  marginRight: number;

  @IsNumber()
  horizontalGap: number;

  @IsNumber()
  verticalGap: number;

  @IsOptional()
  @IsNumber()
  cornerRadius?: number;

  @IsString()
  templateType: string;

  @IsNumber()
  createdBy: number;

  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @IsNumber()
  branchId?: number;
}

export class UpdateCustomTemplateDto extends CreateCustomTemplateDto {
  @IsNumber()
  id: number;
}

export class LabelPreviewDto {
  @IsNumber()
  templateId: number;

  @IsNumber()
  productId: number;

  @IsOptional()
  @IsObject()
  labelData?: any;
}