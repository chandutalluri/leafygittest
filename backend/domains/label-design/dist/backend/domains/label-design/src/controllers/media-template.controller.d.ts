import { MediaTemplateService } from '../services/media-template.service';
import { CreateMediaTemplateDto, UpdateMediaTemplateDto } from '../dto/media-template.dto';
export declare class MediaTemplateController {
    private readonly mediaTemplateService;
    constructor(mediaTemplateService: MediaTemplateService);
    findAll(active?: boolean): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            code: any;
            manufacturer: string;
            description: any;
            dimensions: {
                pageWidth: number;
                pageHeight: number;
                labelWidth: number;
                labelHeight: number;
                columns: number;
                rows: number;
                marginTop: number;
                marginLeft: number;
                spacingX: number;
                spacingY: number;
            };
            orientation: string;
            isActive: any;
            mediaType: any;
            isRoll: boolean;
            isSheet: boolean;
        }[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            code: any;
            manufacturer: string;
            description: any;
            dimensions: {
                pageWidth: number;
                pageHeight: number;
                labelWidth: number;
                labelHeight: number;
                columns: number;
                rows: number;
                marginTop: number;
                marginLeft: number;
                spacingX: number;
                spacingY: number;
            };
            orientation: string;
            isActive: any;
            mediaType: any;
            isRoll: boolean;
            isSheet: boolean;
        };
    }>;
    create(createDto: CreateMediaTemplateDto): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            code: any;
            manufacturer: string;
            description: any;
            dimensions: {
                pageWidth: number;
                pageHeight: number;
                labelWidth: number;
                labelHeight: number;
                columns: number;
                rows: number;
                marginTop: number;
                marginLeft: number;
                spacingX: number;
                spacingY: number;
            };
            orientation: string;
            isActive: any;
            mediaType: any;
            isRoll: boolean;
            isSheet: boolean;
        };
        message: string;
    }>;
    update(id: string, updateDto: UpdateMediaTemplateDto): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            code: any;
            manufacturer: string;
            description: any;
            dimensions: {
                pageWidth: number;
                pageHeight: number;
                labelWidth: number;
                labelHeight: number;
                columns: number;
                rows: number;
                marginTop: number;
                marginLeft: number;
                spacingX: number;
                spacingY: number;
            };
            orientation: string;
            isActive: any;
            mediaType: any;
            isRoll: boolean;
            isSheet: boolean;
        };
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
