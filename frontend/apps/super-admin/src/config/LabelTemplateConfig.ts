
/**
 * Professional Label Template Configuration System
 * Supports real-world label sheets and thermal rolls
 */

export interface LabelDimensions {
  width: number;  // mm
  height: number; // mm
}

export interface MediaMargins {
  top: number;    // mm
  bottom: number; // mm
  left: number;   // mm
  right: number;  // mm
}

export interface LabelSpacing {
  horizontal: number; // mm between labels horizontally
  vertical: number;   // mm between labels vertically
}

export interface LabelTemplate {
  id: string;
  name: string;
  description: string;
  
  // Media type
  mediaType: 'sheet' | 'roll';
  
  // Paper dimensions (for sheets)
  paperWidth?: number;  // mm (e.g., 210 for A4)
  paperHeight?: number; // mm (e.g., 297 for A4)
  
  // Roll specifications (for thermal printers)
  rollWidth?: number;   // mm (e.g., 58mm thermal roll)
  
  // Individual label dimensions
  labelDimensions: LabelDimensions;
  
  // Layout grid (calculated for sheets, 1x continuous for rolls)
  rows: number;
  columns: number;
  
  // Spacing and margins
  margins: MediaMargins;
  spacing: LabelSpacing;
  
  // Print specifications
  printDPI: number;     // 203, 300, 600 DPI
  printerType: 'thermal' | 'inkjet' | 'laser';
  
  // Metadata
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Real-world standard templates
export const STANDARD_TEMPLATES: LabelTemplate[] = [
  // A4 Sheet Templates
  {
    id: 'avery-l7160',
    name: 'Avery L7160 (21 per sheet)',
    description: '63.5 x 38.1mm address labels, 21 per A4 sheet',
    mediaType: 'sheet',
    paperWidth: 210,
    paperHeight: 297,
    labelDimensions: { width: 63.5, height: 38.1 },
    rows: 7,
    columns: 3,
    margins: { top: 15.2, bottom: 15.2, left: 7, right: 7 },
    spacing: { horizontal: 2.5, vertical: 0 },
    printDPI: 300,
    printerType: 'laser',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'avery-l7163',
    name: 'Avery L7163 (14 per sheet)',
    description: '99.1 x 38.1mm shipping labels, 14 per A4 sheet',
    mediaType: 'sheet',
    paperWidth: 210,
    paperHeight: 297,
    labelDimensions: { width: 99.1, height: 38.1 },
    rows: 7,
    columns: 2,
    margins: { top: 15.2, bottom: 15.2, left: 6, right: 6 },
    spacing: { horizontal: 0, vertical: 0 },
    printDPI: 300,
    printerType: 'laser',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'custom-a4-30up',
    name: 'Custom A4 30-up Labels',
    description: '70 x 25mm product labels, 30 per A4 sheet',
    mediaType: 'sheet',
    paperWidth: 210,
    paperHeight: 297,
    labelDimensions: { width: 70, height: 25 },
    rows: 10,
    columns: 3,
    margins: { top: 10, bottom: 10, left: 0, right: 0 },
    spacing: { horizontal: 0, vertical: 2 },
    printDPI: 300,
    printerType: 'laser',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Thermal Roll Templates
  {
    id: 'thermal-58mm-continuous',
    name: '58mm Thermal Roll',
    description: '58mm wide continuous thermal roll for receipts/labels',
    mediaType: 'roll',
    rollWidth: 58,
    labelDimensions: { width: 58, height: 40 }, // Configurable height
    rows: 1,
    columns: 1,
    margins: { top: 2, bottom: 2, left: 2, right: 2 },
    spacing: { horizontal: 0, vertical: 3 },
    printDPI: 203,
    printerType: 'thermal',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'thermal-102mm-shipping',
    name: '102mm Thermal Shipping Labels',
    description: '102 x 76mm thermal shipping labels',
    mediaType: 'roll',
    rollWidth: 102,
    labelDimensions: { width: 102, height: 76 },
    rows: 1,
    columns: 1,
    margins: { top: 2, bottom: 2, left: 2, right: 2 },
    spacing: { horizontal: 0, vertical: 5 },
    printDPI: 203,
    printerType: 'thermal',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Utility functions
export const calculateLabelsPerSheet = (template: LabelTemplate): number => {
  if (template.mediaType === 'roll') return 1; // Continuous
  return template.rows * template.columns;
};

export const calculateCanvasScale = (labelDimensions: LabelDimensions, canvasSize: { width: number, height: number }): number => {
  const scaleX = canvasSize.width / labelDimensions.width;
  const scaleY = canvasSize.height / labelDimensions.height;
  return Math.min(scaleX, scaleY, 3); // Max 3x scale for clarity
};

export const mmToPixels = (mm: number, dpi: number = 300): number => {
  return Math.round((mm * dpi) / 25.4);
};

export const pixelsToMm = (pixels: number, dpi: number = 300): number => {
  return (pixels * 25.4) / dpi;
};
