import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { LabelService } from '../services/label.service';
import { LabelType } from '../dto/create-label.dto';
import { PrintLabelDto } from '../dto/print-label.dto';
export declare class LabelController {
    private readonly labelService;
    constructor(labelService: LabelService);
    getMediaTypes(): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            description: any;
            dimensions: {
                labelWidth: number;
                labelHeight: number;
                pageWidth: number;
                pageHeight: number;
            };
            layout: {
                rows: any;
                columns: any;
                gaps: {
                    x: number;
                    y: number;
                };
                margins: {
                    top: number;
                    bottom: number;
                    left: number;
                    right: number;
                };
            };
            mediaType: any;
        }[];
        total: number;
    }>;
    getMediaTypeById(id: number): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            description: any;
            specifications: {
                labelWidth: number;
                labelHeight: number;
                pageWidth: number;
                pageHeight: number;
                rows: any;
                columns: any;
                totalLabelsPerSheet: number;
            };
            layout: {
                gaps: {
                    x: number;
                    y: number;
                };
                margins: {
                    top: number;
                    bottom: number;
                    left: number;
                    right: number;
                };
            };
            mediaType: any;
        };
    }>;
    getTemplates(type?: LabelType, mediaId?: number, branchId?: number): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            description: any;
            type: any;
            mediaInfo: {
                id: any;
                name: any;
                type: any;
            };
            templateJson: any;
            previewImageUrl: any;
            isPublic: any;
            createdAt: any;
        }[];
        total: number;
    }>;
    getTemplateById(id: number): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            description: any;
            type: any;
            templateConfiguration: any;
            mediaInfo: {
                id: any;
                name: any;
                specifications: any;
            };
            previewImageUrl: any;
            createdAt: any;
        };
    }>;
    createTemplate(templateDto: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    generateLabelPreview(templateId: string, productId: string, branchId?: string): Promise<{
        success: boolean;
        data: {
            templateId: number;
            productId: number;
            branchId: number;
            template: {
                id: any;
                name: any;
                description: any;
                type: any;
                templateConfiguration: any;
                mediaInfo: {
                    id: any;
                    name: any;
                    specifications: any;
                };
                previewImageUrl: any;
                createdAt: any;
            };
            labelData: {
                product_name: any;
                price: any;
                unit: any;
                sku: any;
                category: any;
                stock_level: any;
                expiry_date: any;
                batch_id: string;
                serial_number: string;
            };
            previewUrl: string;
        };
    }>;
    generateBatchPreview(batchDto: {
        templateId: number;
        productIds: number[];
        branchId?: number;
    }): Promise<{
        success: boolean;
        data: {
            templateId: number;
            productIds: number[];
            branchId: number;
            previews: {
                templateId: number;
                productId: number;
                branchId: number;
                template: {
                    id: any;
                    name: any;
                    description: any;
                    type: any;
                    templateConfiguration: any;
                    mediaInfo: {
                        id: any;
                        name: any;
                        specifications: any;
                    };
                    previewImageUrl: any;
                    createdAt: any;
                };
                labelData: {
                    product_name: any;
                    price: any;
                    unit: any;
                    sku: any;
                    category: any;
                    stock_level: any;
                    expiry_date: any;
                    batch_id: string;
                    serial_number: string;
                };
                previewUrl: string;
            }[];
            totalLabels: number;
        };
    }>;
    printLabels(printDto: PrintLabelDto): Promise<{
        success: boolean;
        data: {
            jobId: any;
            jobNumber: any;
            quantity: number;
            serialNumbers: string[];
            printLogs: number;
            downloadUrl: string;
            status: string;
        };
        message: string;
    }>;
    getPrintJobs(branchId?: number, status?: string, limit?: number): Promise<{
        success: boolean;
        data: any[];
        total: number;
    }>;
    getPrintJobDetails(jobId: number): Promise<{
        success: boolean;
        data: {
            job: any;
            printLogs: any[];
            totalLabels: number;
        };
    }>;
    downloadPrintJob(jobId: number, res: Response): Promise<StreamableFile>;
    getSuitableTemplates(productId: number): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            description: any;
            type: any;
            mediaInfo: {
                id: any;
                name: any;
                type: any;
            };
            templateJson: any;
            previewImageUrl: any;
            isPublic: any;
            createdAt: any;
        }[];
        productInfo: {
            id: any;
            name: any;
            category: any;
        };
    }>;
    getBranchSettings(branchId: number): Promise<{
        success: boolean;
        data: any;
    }>;
    updateBranchSettings(branchId: number, settings: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    verifyLabel(serialNumber: string): Promise<{
        success: boolean;
        verified: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        verified: boolean;
        data: any;
        message: string;
    }>;
    getComplianceAudit(branchId?: number, fromDate?: string, toDate?: string): Promise<{
        success: boolean;
        data: {
            auditPeriod: {
                from: string;
                to: string;
            };
            compliance: {
                fssaiCompliance: number;
                labelAccuracy: number;
                traceability: number;
            };
            summary: string;
        };
    }>;
    getAnalyticsOverview(): Promise<{
        success: boolean;
        data: {
            totalPrintJobs: number;
            totalLabels: number;
            activeTemplates: number;
            systemHealth: string;
            lastUpdated: string;
        };
    }>;
    getBranchAnalytics(branchId: number): Promise<{
        success: boolean;
        data: {
            branchId: number;
            totalPrintJobs: number;
            totalLabels: number;
            efficiency: number;
            lastActivity: string;
        };
    }>;
    generateQRCode(qrDto: {
        content: string;
        type: 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'whatsapp';
        size?: number;
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
        foregroundColor?: string;
        backgroundColor?: string;
        margin?: number;
        format?: 'png' | 'svg' | 'pdf';
    }): Promise<{
        success: boolean;
        data: {
            id: any;
            content: string;
            type: "url" | "text" | "email" | "phone" | "sms" | "wifi" | "vcard" | "whatsapp";
            url: string;
            options: {
                size: string;
                data: string;
                format: "pdf" | "png" | "svg";
                ecc: "L" | "M" | "Q" | "H";
                color: string;
                bgcolor: string;
                margin: string;
                qzone: string;
            };
            createdAt: any;
            note?: undefined;
        };
    } | {
        success: boolean;
        data: {
            content: string;
            type: "url" | "text" | "email" | "phone" | "sms" | "wifi" | "vcard" | "whatsapp";
            url: string;
            options: {
                size: number;
            };
            note: string;
            id?: undefined;
            createdAt?: undefined;
        };
    }>;
    previewQRCode(content: string, type?: string, size?: number, foregroundColor?: string, backgroundColor?: string): Promise<{
        success: boolean;
        data: {
            content: string;
            previewUrl: string;
            originalContent: string;
            type: string;
        };
    }>;
    getQRTemplates(): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            type: string;
            description: string;
            template: string;
            color: string;
            backgroundColor: string;
        }[];
    }>;
    generateProductQRCode(productId: number, options: {
        includePrice?: boolean;
        includeBranch?: boolean;
        customUrl?: string;
        branchId?: number;
    }): Promise<{
        success: boolean;
        data: {
            product: {
                id: any;
                name: any;
                sku: any;
                price: any;
            };
            id: any;
            content: string;
            type: "url" | "text" | "email" | "phone" | "sms" | "wifi" | "vcard" | "whatsapp";
            url: string;
            options: {
                size: string;
                data: string;
                format: "pdf" | "png" | "svg";
                ecc: "L" | "M" | "Q" | "H";
                color: string;
                bgcolor: string;
                margin: string;
                qzone: string;
            };
            createdAt: any;
            note?: undefined;
        } | {
            product: {
                id: any;
                name: any;
                sku: any;
                price: any;
            };
            content: string;
            type: "url" | "text" | "email" | "phone" | "sms" | "wifi" | "vcard" | "whatsapp";
            url: string;
            options: {
                size: number;
            };
            note: string;
            id?: undefined;
            createdAt?: undefined;
        };
    }>;
    proxyQRCode(query: any, res: Response): Promise<Response<any, Record<string, any>>>;
    healthCheck(): Promise<{
        status: string;
        service: string;
        version: string;
        timestamp: string;
        database: string;
        integrations: {
            product_orchestrator: string;
            image_management: string;
            inventory_management: string;
            direct_data_gateway: string;
            qr_code_generator: string;
        };
    }>;
}
