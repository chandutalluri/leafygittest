export declare class CreateDesignTemplateDto {
    name: string;
    description?: string;
    category: string;
    mediaTypeId: number;
    templateData: any;
}
export declare class UpdateDesignTemplateDto {
    name?: string;
    description?: string;
    category?: string;
    mediaTypeId?: number;
    templateData?: any;
    isActive?: boolean;
}
