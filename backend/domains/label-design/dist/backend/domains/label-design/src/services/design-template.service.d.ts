import { CreateDesignTemplateDto, UpdateDesignTemplateDto } from '../dto/design-template.dto';
export declare class DesignTemplateService {
    private pool;
    constructor();
    findAll(active?: boolean): Promise<{
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
    }[]>;
    findOne(id: number): Promise<{
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
    }>;
    create(createDto: CreateDesignTemplateDto): Promise<{
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
    }>;
    update(id: number, updateDto: UpdateDesignTemplateDto): Promise<{
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
    }>;
    delete(id: number): Promise<void>;
}
