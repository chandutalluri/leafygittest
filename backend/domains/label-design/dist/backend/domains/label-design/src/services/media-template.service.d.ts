import { CreateMediaTemplateDto, UpdateMediaTemplateDto } from '../dto/media-template.dto';
export declare class MediaTemplateService {
    private pool;
    constructor();
    findAll(active?: boolean): Promise<{
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
    }[]>;
    findOne(id: number): Promise<{
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
    }>;
    create(createDto: CreateMediaTemplateDto): Promise<{
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
    }>;
    update(id: number, updateDto: UpdateMediaTemplateDto): Promise<{
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
    }>;
    delete(id: number): Promise<void>;
}
