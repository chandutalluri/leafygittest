import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
  Min,
  Max,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompositeProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Organic Basmati Rice',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Premium quality organic basmati rice from local farms',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @ApiProperty({
    description: 'Stock Keeping Unit (SKU)',
    example: 'ORG-RICE-001',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @Length(0, 50)
  sku?: string;

  @ApiProperty({
    description: 'Product price in rupees',
    example: 299.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Discount percentage',
    example: 10,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discount?: number;

  @ApiProperty({
    description: 'Tax rate percentage',
    example: 18,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  taxRate?: number;

  @ApiProperty({
    description: 'Category ID to assign the product',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'Array of branch IDs where the product will be available',
    example: [3, 4],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  branchIds: number[];

  @ApiProperty({
    description: 'Opening stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  openingStock: number;

  @ApiProperty({
    description: 'Reorder level for inventory alerts',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  reorderLevel: number;

  @ApiProperty({
    description: 'Product image file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  imageFile?: any;
}