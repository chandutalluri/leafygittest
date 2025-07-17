import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImageService } from './services/image.service';
import { ImageOptimizationService } from './services/image-optimization.service';
import { FileStructureService } from './services/file-structure.service';
import { FixedImageService } from './fixed-image.service';
import { AdminImageController } from './controllers/admin-image.controller';
import { ImageServeController } from './controllers/image-serve.controller';
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
  controllers: [AdminImageController, ImageServeController, BulkOperationsController],
  providers: [ImageService, ImageOptimizationService, FileStructureService, CleanImageService, FixedImageService],
  exports: [ImageService, ImageOptimizationService, FileStructureService, CleanImageService, FixedImageService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly fileStructureService: FileStructureService) {}

  async onModuleInit() {
    // Initialize industry-standard file structure on startup
    await this.fileStructureService.initializeFileStructure();
    console.log('📁 Industry-standard file structure initialized');
  }
}