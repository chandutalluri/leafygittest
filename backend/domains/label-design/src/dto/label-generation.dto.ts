import { IsNumber, IsArray, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ description: 'Quantity of labels' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Custom data overrides', required: false })
  @IsObject()
  @IsOptional()
  customData?: any;
}

export class GeneratePreviewDto {
  @ApiProperty({ description: 'Template ID' })
  @IsNumber()
  templateId: number;

  @ApiProperty({ description: 'Product ID', required: false })
  @IsNumber()
  @IsOptional()
  productId?: number;

  @ApiProperty({ description: 'Custom data for placeholders', required: false })
  @IsObject()
  @IsOptional()
  customData?: any;
}

export class GenerateBatchDto {
  @ApiProperty({ description: 'Template ID' })
  @IsNumber()
  templateId: number;

  @ApiProperty({ description: 'Media template ID' })
  @IsNumber()
  mediaId: number;

  @ApiProperty({ description: 'Products with quantities' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  products: ProductItemDto[];
}

export class ExportPdfDto extends GenerateBatchDto {
  @ApiProperty({ description: 'PDF options', required: false })
  @IsObject()
  @IsOptional()
  pdfOptions?: {
    format?: string;
    orientation?: 'portrait' | 'landscape';
    margin?: number;
  };
}

export class ApplyPlaceholdersDto {
  @ApiProperty({ description: 'Label elements' })
  @IsArray()
  elements: any[];

  @ApiProperty({ description: 'Product data for placeholders' })
  @IsObject()
  productData: any;
}