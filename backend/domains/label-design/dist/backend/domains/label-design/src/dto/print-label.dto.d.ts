export declare enum PrintFormat {
    PDF = "pdf",
    ZPL = "zpl",
    PNG = "png"
}
export declare class PrintLabelDto {
    templateId: number;
    productId: number;
    quantity: number;
    format: string;
    mediaId: number;
    branchId: number;
    printerName?: string;
    serialStart?: string;
    serialEnd?: string;
    batchId?: string;
    expiryDate?: string;
    metadata?: any;
}
export declare class CreateCustomTemplateDto {
    name: string;
    description?: string;
    paperSize: string;
    paperWidth: number;
    paperHeight: number;
    labelWidth: number;
    labelHeight: number;
    horizontalCount: number;
    verticalCount: number;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
    horizontalGap: number;
    verticalGap: number;
    cornerRadius?: number;
    templateType: string;
    createdBy: number;
    companyId?: number;
    branchId?: number;
}
export declare class UpdateCustomTemplateDto extends CreateCustomTemplateDto {
    id: number;
}
export declare class LabelPreviewDto {
    templateId: number;
    productId: number;
    labelData?: any;
}
