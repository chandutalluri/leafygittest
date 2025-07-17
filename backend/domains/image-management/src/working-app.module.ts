import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImageService } from './services/image.service';
import { ImageOptimizationService } from './services/image-optimization.service';
import { FileStructureService } from './services/file-structure.service';
import { EnhancedImageController } from './enhanced-image.controller';
import { BulkOperationsController } from './bulk-operations.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './uploads/temp',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [EnhancedImageController, BulkOperationsController],
  providers: [ImageService, ImageOptimizationService, FileStructureService],
  exports: [ImageService, ImageOptimizationService, FileStructureService],
})
export class WorkingAppModule implements OnModuleInit {
  constructor(private readonly fileStructureService: FileStructureService) {}

  async onModuleInit() {
    try {
      await this.fileStructureService.initializeFileStructure();
      console.log('📁 Industry-standard file structure initialized');
      console.log('🎯 File structure: products/{thumbnail,small,medium,large,original,mobile-*,desktop-*}');
      console.log('🎯 PWA optimization: mobile-thumb, mobile-card, tablet-card variants');
      console.log('🎯 Multi-screen support: responsive image variants for all devices');
    } catch (error) {
      console.error('Failed to initialize file structure:', error);
    }
  }
}