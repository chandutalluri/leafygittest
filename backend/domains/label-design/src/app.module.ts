import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { ConfigModule } from '@nestjs/config';
import { LabelController } from './controllers/label.controller';
import { TemplateController } from './controllers/template.controller';
import { CustomTemplateController } from './controllers/custom-template.controller';
import { BarcodeController } from './controllers/barcode.controller';
import { PrintController } from './controllers/print.controller';
import { ComplianceController } from './controllers/compliance.controller';
import { HealthController } from './controllers/health.controller';
import { MediaTemplateController } from './controllers/media-template.controller';
import { MediaTypesController } from './controllers/media-types.controller';
import { MinimalTemplateController } from './controllers/minimal-template.controller';
import { DesignTemplateController } from './controllers/design-template.controller';
import { LabelService } from './services/label.service';
import { TemplateService } from './services/template.service';
import { CustomTemplateService } from './services/custom-template.service';
import { BarcodeService } from './services/barcode.service';
import { PrintService } from './services/print.service';
import { ComplianceService } from './services/compliance.service';
import { MediaTemplateService } from './services/media-template.service';
import { MinimalTemplateService } from './services/minimal-template.service';
import { MediaTypesService } from './services/media-types.service';
import { DesignTemplateService } from './services/design-template.service';

@Module({
  imports: [SharedAuthModule, ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [
    LabelController,
    TemplateController,
    CustomTemplateController,
    BarcodeController,
    PrintController,
    ComplianceController,
    HealthController,
    MediaTemplateController,
    MediaTypesController,
    MinimalTemplateController,
    DesignTemplateController,
  ],
  providers: [
    LabelService,
    TemplateService,
    CustomTemplateService,
    BarcodeService,
    PrintService,
    ComplianceService,
    MediaTemplateService,
    MinimalTemplateService,
    MediaTypesService,
    DesignTemplateService,
  ],
})
export class AppModule {}