declare class DimensionsDto {
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
}
export declare class CreateMediaTemplateDto {
    name: string;
    code: string;
    manufacturer?: string;
    description?: string;
    dimensions: DimensionsDto;
    orientation: 'portrait' | 'landscape';
}
export declare class UpdateMediaTemplateDto {
    name?: string;
    code?: string;
    manufacturer?: string;
    description?: string;
    dimensions?: Partial<DimensionsDto>;
    orientation?: 'portrait' | 'landscape';
    isActive?: boolean;
}
export {};
