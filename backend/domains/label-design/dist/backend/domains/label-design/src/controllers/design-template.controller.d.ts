import { DesignTemplateService } from '../services/design-template.service';
import { CreateDesignTemplateDto, UpdateDesignTemplateDto } from '../dto/design-template.dto';
export declare class DesignTemplateController {
    private readonly designTemplateService;
    constructor(designTemplateService: DesignTemplateService);
    findAll(active?: boolean): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            description: any;
            category: any;
            mediaTypeId: any;
            mediaTypeName: any;
            mediaTypeCode: any;
            templateData: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        }[];
        message: string;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            description: any;
            category: any;
            mediaTypeId: any;
            mediaTypeName: any;
            mediaTypeCode: any;
            templateData: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
        message: string;
    }>;
    create(createDto: CreateDesignTemplateDto): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            description: any;
            category: any;
            mediaTypeId: any;
            mediaTypeName: any;
            mediaTypeCode: any;
            templateData: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
        message: string;
    }>;
    update(id: string, updateDto: UpdateDesignTemplateDto): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            description: any;
            category: any;
            mediaTypeId: any;
            mediaTypeName: any;
            mediaTypeCode: any;
            templateData: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
