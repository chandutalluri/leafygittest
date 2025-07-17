import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCompositeProductDto } from './dto/create-composite-product.dto';
import axios from 'axios';
import { Pool } from 'pg';

@Injectable()
export class ProductOrchestratorService {
  private readonly logger = new Logger(ProductOrchestratorService.name);
  private readonly pool: Pool;
  
  private readonly serviceUrls = {
    catalog: process.env.CATALOG_SERVICE_URL || 'http://localhost:3022',
    inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3025',
    images: process.env.IMAGE_SERVICE_URL || 'http://localhost:3023',
    categories: process.env.CATEGORY_SERVICE_URL || 'http://localhost:3024',
    labels: process.env.LABEL_SERVICE_URL || 'http://localhost:3027',
  };

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  async createCompositeProduct(
    createProductDto: CreateCompositeProductDto,
    user: any,
  ) {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.logger.log(`Starting composite product creation with transaction ID: ${transactionId}`);

    const rollbackActions = [];
    let productId: string;
    let inventoryId: string;
    let imageUrl: string;
    let categoryAssignmentId: string;
    let labelId: string;

    try {
      // Step 1: Create core product in catalog-management
      this.logger.log('Step 1: Creating product in catalog service');
      const catalogResponse = await this.createCatalogProduct(createProductDto, user);
      productId = catalogResponse.data.id;
      rollbackActions.push(() => this.rollbackCatalogProduct(productId));

      // Step 2: Initialize inventory for selected branches
      this.logger.log('Step 2: Initializing inventory');
      const inventoryResponse = await this.initializeInventory(
        productId,
        createProductDto,
        user,
      );
      inventoryId = inventoryResponse.data.id;
      rollbackActions.push(() => this.rollbackInventory(inventoryId));

      // Step 3: Upload product image (if provided)
      if (createProductDto.imageFile) {
        this.logger.log('Step 3: Uploading product image');
        const imageResponse = await this.uploadProductImage(
          productId,
          createProductDto.imageFile,
          user,
        );
        imageUrl = imageResponse.data.url;
        rollbackActions.push(() => this.rollbackImage(imageUrl));
      }

      // Step 4: Update product with category (direct database operation)
      this.logger.log('Step 4: Updating product category in database');
      await this.updateProductCategory(productId, createProductDto.categoryId);

      this.logger.log('Step 5: Product creation completed successfully');

      this.logger.log(`Successfully completed composite product creation: ${transactionId}`);

      return {
        success: true,
        transactionId,
        productId,
        inventoryId,
        message: `Product "${createProductDto.name}" created successfully`,
        services: {
          catalog: catalogResponse.data,
          inventory: inventoryResponse.data,
          category: { updated: true },
        },
      };
    } catch (error) {
      this.logger.error(`Error in composite product creation: ${error.message}`);
      await this.performRollback(rollbackActions);
      throw error;
    }
  }

  private async createCatalogProduct(dto: CreateCompositeProductDto, user: any) {
    try {
      // Direct database insertion for products
      const client = await this.pool.connect();
      
      try {
        const productQuery = `
          INSERT INTO products (
            name, description, price, discount_percentage, tax_rate, 
            category_id, is_active, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          RETURNING id, name, price
        `;
        
        const result = await client.query(productQuery, [
          dto.name,
          dto.description,
          dto.price,
          dto.discount || 0,
          dto.taxRate || 18, // Default GST rate for India
          dto.categoryId || 1, // Default category
          true
        ]);
        
        const product = result.rows[0];
        this.logger.log(`Created product in database: ${product.id}`);
        
        return {
          data: {
            id: product.id,
            name: product.name,
            price: product.price,
            success: true
          }
        };
      } finally {
        client.release();
      }
    } catch (error) {
      this.logger.error(`Database error creating product: ${error.message}`);
      throw new HttpException(
        `Product creation failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async initializeInventory(productId: string, dto: CreateCompositeProductDto, user: any) {
    try {
      const client = await this.pool.connect();
      
      try {
        // Create inventory record for each selected branch
        const inventoryQuery = `
          INSERT INTO inventory (
            product_id, current_stock, reorder_level, 
            last_updated, created_at
          ) VALUES ($1, $2, $3, NOW(), NOW())
          RETURNING id, product_id, current_stock
        `;
        
        const openingStock = dto.openingStock || 100; // Default opening stock
        const reorderLevel = dto.reorderLevel || 10; // Default reorder level
        
        const result = await client.query(inventoryQuery, [
          productId,
          openingStock,
          reorderLevel
        ]);
        
        const inventory = result.rows[0];
        this.logger.log(`Created inventory record: ${inventory.id}`);
        
        return {
          data: {
            id: inventory.id,
            productId: inventory.product_id,
            currentStock: inventory.current_stock,
            success: true
          }
        };
      } finally {
        client.release();
      }
    } catch (error) {
      this.logger.error(`Database error creating inventory: ${error.message}`);
      throw new HttpException(
        `Inventory creation failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async uploadProductImage(productId: string, imageFile: any, user: any) {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('productId', productId);
      formData.append('uploadedBy', user.id);

      const response = await axios.post(
        `${this.serviceUrls.images}/api/images/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Image service error: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async assignToCategory(productId: string, categoryId: number, user: any) {
    try {
      const response = await axios.post(
        `${this.serviceUrls.categories}/api/categories/assign`,
        {
          productId,
          categoryId,
          assignedBy: user.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Category service error: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateProductLabel(productId: string, dto: CreateCompositeProductDto, user: any) {
    try {
      const response = await axios.post(
        `${this.serviceUrls.labels}/api/labels/generate`,
        {
          productId,
          productName: dto.name,
          price: dto.price,
          sku: dto.sku,
          branchId: user.branchId,
          generateQR: true,
          createdBy: user.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Label service error: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async performRollback(rollbackActions: Array<() => Promise<void>>) {
    this.logger.warn('Performing rollback due to error');
    
    for (const rollbackAction of rollbackActions.reverse()) {
      try {
        await rollbackAction();
      } catch (rollbackError) {
        this.logger.error(`Rollback action failed: ${rollbackError.message}`);
      }
    }
  }

  private async rollbackCatalogProduct(productId: string) {
    try {
      await axios.delete(`${this.serviceUrls.catalog}/api/catalog/products/${productId}`);
      this.logger.log(`Rolled back catalog product: ${productId}`);
    } catch (error) {
      this.logger.error(`Failed to rollback catalog product: ${error.message}`);
    }
  }

  private async rollbackInventory(inventoryId: string) {
    try {
      await axios.delete(`${this.serviceUrls.inventory}/api/inventory/${inventoryId}`);
      this.logger.log(`Rolled back inventory: ${inventoryId}`);
    } catch (error) {
      this.logger.error(`Failed to rollback inventory: ${error.message}`);
    }
  }

  private async rollbackImage(imageUrl: string) {
    try {
      await axios.delete(`${this.serviceUrls.images}/api/images`, {
        data: { url: imageUrl },
      });
      this.logger.log(`Rolled back image: ${imageUrl}`);
    } catch (error) {
      this.logger.error(`Failed to rollback image: ${error.message}`);
    }
  }

  private async rollbackCategoryAssignment(assignmentId: string) {
    try {
      await axios.delete(`${this.serviceUrls.categories}/api/categories/assign/${assignmentId}`);
      this.logger.log(`Rolled back category assignment: ${assignmentId}`);
    } catch (error) {
      this.logger.error(`Failed to rollback category assignment: ${error.message}`);
    }
  }

  private async rollbackLabel(labelId: string) {
    try {
      await axios.delete(`${this.serviceUrls.labels}/api/labels/${labelId}`);
      this.logger.log(`Rolled back label: ${labelId}`);
    } catch (error) {
      this.logger.error(`Failed to rollback label: ${error.message}`);
    }
  }

  private async updateProductCategory(productId: string, categoryId: number) {
    try {
      const client = await this.pool.connect();
      
      try {
        const updateQuery = `
          UPDATE products 
          SET category_id = $1, updated_at = NOW()
          WHERE id = $2
          RETURNING id, category_id
        `;
        
        const result = await client.query(updateQuery, [categoryId, productId]);
        
        if (result.rows.length === 0) {
          throw new Error(`Product with ID ${productId} not found`);
        }
        
        this.logger.log(`Updated product ${productId} with category ${categoryId}`);
        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      this.logger.error(`Database error updating product category: ${error.message}`);
      throw new HttpException(
        `Failed to update product category: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}