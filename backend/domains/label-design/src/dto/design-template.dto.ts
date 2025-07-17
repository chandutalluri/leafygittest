import { IsString, IsNumber, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDesignTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Template description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Template category (e.g., "product_label", "price_tag")' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Media type ID (references the physical label dimensions)' })
  @IsNumber()
  mediaTypeId: number;

  @ApiProperty({ 
    description: 'Template design data (QR codes, text fields, product fields, etc.)',
    type: 'object',
    additionalProperties: true,
    example: {
      elements: [
        {
          type: 'text',
          content: '${product.name}',
          position: { x: 10, y: 10 },
          fontSize: 12,
          fontFamily: 'Arial'
        },
        {
          type: 'qr',
          content: '${product.url}',
          position: { x: 200, y: 10 },
          size: 50
        },
        {
          type: 'barcode',
          content: '${product.barcode}',
          position: { x: 10, y: 100 },
          format: 'CODE128'
        }
      ]
    }
  })
  @IsObject()
  templateData: any;
}

export class UpdateDesignTemplateDto {
  @ApiProperty({ description: 'Template name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Template category', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Media type ID', required: false })
  @IsNumber()
  @IsOptional()
  mediaTypeId?: number;

  @ApiProperty({ description: 'Template design data', type: 'object', additionalProperties: true })
  @IsObject()
  @IsOptional()
  templateData?: any;

  @ApiProperty({ description: 'Active status', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}