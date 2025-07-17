import { CreateCustomTemplateDto, UpdateCustomTemplateDto } from '../dto/print-label.dto';
export declare class CustomTemplateService {
    createCustomTemplate(createDto: CreateCustomTemplateDto): Promise<{
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: any;
        data?: undefined;
        message?: undefined;
    }>;
    getCustomTemplates(filters: {
        templateType?: string;
        branchId?: number;
        companyId?: number;
    }): Promise<{
        success: boolean;
        data: any[];
        total: number;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: any;
        data?: undefined;
        total?: undefined;
        message?: undefined;
    }>;
    getCustomTemplateById(id: number): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
        message?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: any;
        data?: undefined;
        message?: undefined;
    }>;
    updateCustomTemplate(id: number, updateDto: UpdateCustomTemplateDto): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
        message?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: any;
        data?: undefined;
        message?: undefined;
    }>;
    deleteCustomTemplate(id: number): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
        message?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: any;
        data?: undefined;
        message?: undefined;
    }>;
    generatePreview(id: number): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
        message?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: any;
        data?: undefined;
        message?: undefined;
    }>;
    getUsageStats(): Promise<{
        success: boolean;
        data: {
            totalTemplates: number;
            templateTypeBreakdown: {};
            paperSizeBreakdown: {};
            averageLabelCount: number;
        };
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        error: string;
        details: any;
        data?: undefined;
        message?: undefined;
    }>;
}
