import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ProductOrchestratorService } from './product-orchestrator.service';
import { CreateCompositeProductDto } from './dto/create-composite-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Product Orchestrator')
@Controller('products')
export class ProductOrchestratorController {
  private readonly logger = new Logger(ProductOrchestratorController.name);

  constructor(
    private readonly productOrchestratorService: ProductOrchestratorService,
  ) {}

  @Post('create-composite')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Create product with unified workflow',
    description: 'Creates a product by orchestrating catalog, inventory, image, category, and label services'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Product created successfully across all services' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error or service failure' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error during orchestration' 
  })
  @ApiBearerAuth()
  async createCompositeProduct(
    @Body() createProductDto: CreateCompositeProductDto,
    @Request() req: any,
  ) {
    try {
      // Mock user for testing when authentication is disabled
      const user = req.user || {
        id: '1dd86990-7103-4862-a6d1-1065ae7b05ff',
        email: 'ops.admin@leafyhealth.com',
        role: 'super_admin',
        type: 'internal'
      };
      this.logger.log(`Creating composite product: ${createProductDto.name} by user: ${user.email}`);

      const result = await this.productOrchestratorService.createCompositeProduct(
        createProductDto,
        user,
      );

      this.logger.log(`Successfully created composite product with ID: ${result.productId}`);
      
      return {
        success: true,
        message: 'Product created successfully across all services',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to create composite product: ${error.message}`, error.stack);
      
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to create product',
          error: error.name || 'ProductCreationError',
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check for product orchestrator' })
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'product-orchestrator',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Post('test-auth')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test JWT authentication' })
  async testAuth(@Request() req: any) {
    return {
      message: 'Authentication successful',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}