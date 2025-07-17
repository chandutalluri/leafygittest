
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';

@Controller('marketplace')
class MarketplaceController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'marketplace-management',
      port: process.env.PORT || 3036,
      timestamp: new Date().toISOString()
    };
  }

  @Get('vendors')
  async getVendors(@Query() query: any) {
    try {
      // Mock vendor data for now
      const vendors = [
        { id: 1, name: 'Organic Farms Ltd', status: 'active', type: 'supplier' },
        { id: 2, name: 'Fresh Produce Co', status: 'active', type: 'distributor' }
      ];
      return { success: true, data: vendors };
    } catch (error) {
      return { success: false, message: 'Failed to fetch vendors' };
    }
  }

  @Post('vendors')
  async createVendor(@Body() body: any) {
    try {
      const vendor = { id: Date.now(), ...body, status: 'active' };
      return { success: true, data: vendor };
    } catch (error) {
      return { success: false, message: 'Failed to create vendor' };
    }
  }

  @Put('vendors/:id')
  async updateVendor(@Param('id') id: string, @Body() body: any) {
    try {
      const vendor = { id: parseInt(id), ...body };
      return { success: true, data: vendor };
    } catch (error) {
      return { success: false, message: 'Failed to update vendor' };
    }
  }

  @Get('marketplaces')
  async getMarketplaces() {
    try {
      const marketplaces = [
        { id: 1, name: 'Amazon Fresh', status: 'connected', commission: 15 },
        { id: 2, name: 'BigBasket', status: 'connected', commission: 12 }
      ];
      return { success: true, data: marketplaces };
    } catch (error) {
      return { success: false, message: 'Failed to fetch marketplaces' };
    }
  }

  @Post('marketplaces')
  async createMarketplace(@Body() body: any) {
    try {
      const marketplace = { id: Date.now(), ...body, status: 'pending' };
      return { success: true, data: marketplace };
    } catch (error) {
      return { success: false, message: 'Failed to create marketplace' };
    }
  }
}

@Module({
  controllers: [MarketplaceController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3036;
  await app.listen(port, '127.0.0.1');
  console.log(`Marketplace Management Service running on port ${port}`);
}

bootstrap();
