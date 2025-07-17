import { MediaTypesService } from '../services/media-types.service';
import { CreateMediaTypeDto, UpdateMediaTypeDto } from '../dto/media-types.dto';
export declare class MediaTypesController {
    private readonly mediaTypesService;
    constructor(mediaTypesService: MediaTypesService);
    findAll(active?: boolean): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            manufacturer: string;
            productCode: any;
            description: any;
            physicalProperties: {
                labelWidth: number;
                labelHeight: number;
                pageWidth: number;
                pageHeight: number;
                labelsPerRow: number;
                labelsPerColumn: number;
                totalLabelsPerSheet: number;
                marginTop: number;
                marginLeft: number;
                marginRight: number;
                marginBottom: number;
                horizontalSpacing: number;
                verticalSpacing: number;
            };
            mediaType: any;
            orientation: string;
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
            manufacturer: string;
            productCode: any;
            description: any;
            physicalProperties: {
                labelWidth: number;
                labelHeight: number;
                pageWidth: number;
                pageHeight: number;
                labelsPerRow: number;
                labelsPerColumn: number;
                totalLabelsPerSheet: number;
                marginTop: number;
                marginLeft: number;
                marginRight: number;
                marginBottom: number;
                horizontalSpacing: number;
                verticalSpacing: number;
            };
            mediaType: any;
            orientation: string;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
        message: string;
    }>;
    create(createDto: CreateMediaTypeDto): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            manufacturer: string;
            productCode: any;
            description: any;
            physicalProperties: {
                labelWidth: number;
                labelHeight: number;
                pageWidth: number;
                pageHeight: number;
                labelsPerRow: number;
                labelsPerColumn: number;
                totalLabelsPerSheet: number;
                marginTop: number;
                marginLeft: number;
                marginRight: number;
                marginBottom: number;
                horizontalSpacing: number;
                verticalSpacing: number;
            };
            mediaType: any;
            orientation: string;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
        message: string;
    }>;
    update(id: string, updateDto: UpdateMediaTypeDto): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            manufacturer: string;
            productCode: any;
            description: any;
            physicalProperties: {
                labelWidth: number;
                labelHeight: number;
                pageWidth: number;
                pageHeight: number;
                labelsPerRow: number;
                labelsPerColumn: number;
                totalLabelsPerSheet: number;
                marginTop: number;
                marginLeft: number;
                marginRight: number;
                marginBottom: number;
                horizontalSpacing: number;
                verticalSpacing: number;
            };
            mediaType: any;
            orientation: string;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: any;
            name: any;
            manufacturer: string;
            productCode: any;
            description: any;
            physicalProperties: {
                labelWidth: number;
                labelHeight: number;
                pageWidth: number;
                pageHeight: number;
                labelsPerRow: number;
                labelsPerColumn: number;
                totalLabelsPerSheet: number;
                marginTop: number;
                marginLeft: number;
                marginRight: number;
                marginBottom: number;
                horizontalSpacing: number;
                verticalSpacing: number;
            };
            mediaType: any;
            orientation: string;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
    }>;
}
