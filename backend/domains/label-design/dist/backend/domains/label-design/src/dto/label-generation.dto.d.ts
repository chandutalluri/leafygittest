declare class ProductItemDto {
    productId: number;
    quantity: number;
    customData?: any;
}
export declare class GeneratePreviewDto {
    templateId: number;
    productId?: number;
    customData?: any;
}
export declare class GenerateBatchDto {
    templateId: number;
    mediaId: number;
    products: ProductItemDto[];
}
export declare class ExportPdfDto extends GenerateBatchDto {
    pdfOptions?: {
        format?: string;
        orientation?: 'portrait' | 'landscape';
        margin?: number;
    };
}
export declare class ApplyPlaceholdersDto {
    elements: any[];
    productData: any;
}
export {};
