declare class PhysicalPropertiesDto {
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
}
export declare class CreateMediaTypeDto {
    name: string;
    manufacturer?: string;
    productCode: string;
    description?: string;
    physicalProperties: PhysicalPropertiesDto;
    mediaType?: 'sheet' | 'roll';
    orientation?: 'portrait' | 'landscape';
}
export declare class UpdateMediaTypeDto {
    name?: string;
    manufacturer?: string;
    productCode?: string;
    description?: string;
    physicalProperties?: Partial<PhysicalPropertiesDto>;
    mediaType?: 'sheet' | 'roll';
    orientation?: 'portrait' | 'landscape';
    isActive?: boolean;
}
export {};
