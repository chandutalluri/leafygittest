export declare class MinimalTemplateService {
    private db;
    private client;
    constructor();
    findAll(): Promise<{
        success: boolean;
        data: any;
        total: any;
        message: string;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    create(templateData: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    update(id: number, updateData: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    remove(id: number): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
}
