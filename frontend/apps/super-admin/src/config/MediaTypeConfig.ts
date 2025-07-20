export interface MediaTypeSize {
  width: number;
  height: number;
}

export interface MediaTypeConfig {
  name: string;
  displayName: string;
  pageSizeMM: MediaTypeSize;
  labelSizeMM: MediaTypeSize;
  rows: number;
  cols: number;
  labelsPerPage: number;
  paddingMM: number;
  printType: 'sheet' | 'roll';
}

export const mediaTypes: Record<string, MediaTypeConfig> = {
  // A4 Sheet formats
  'a4-small': {
    name: 'a4-small',
    displayName: 'A4 Sheet - Small Labels (30 per page)',
    pageSizeMM: { width: 210, height: 297 },
    labelSizeMM: { width: 63.5, height: 29.6 },
    rows: 10,
    cols: 3,
    labelsPerPage: 30,
    paddingMM: 2,
    printType: 'sheet',
  },
  'a4-medium': {
    name: 'a4-medium',
    displayName: 'A4 Sheet - Medium Labels (12 per page)',
    pageSizeMM: { width: 210, height: 297 },
    labelSizeMM: { width: 60, height: 71 },
    rows: 4,
    cols: 3,
    labelsPerPage: 12,
    paddingMM: 2,
    printType: 'sheet',
  },
  'a4-large': {
    name: 'a4-large',
    displayName: 'A4 Sheet - Large Labels (6 per page)',
    pageSizeMM: { width: 210, height: 297 },
    labelSizeMM: { width: 99.1, height: 93.1 },
    rows: 3,
    cols: 2,
    labelsPerPage: 6,
    paddingMM: 2,
    printType: 'sheet',
  },

  // Thermal Roll formats
  'thermal-small': {
    name: 'thermal-small',
    displayName: 'Thermal Roll - Small (30x50mm)',
    pageSizeMM: { width: 30, height: 50 },
    labelSizeMM: { width: 30, height: 50 },
    rows: 1,
    cols: 1,
    labelsPerPage: 1,
    paddingMM: 0,
    printType: 'roll',
  },
  'thermal-medium': {
    name: 'thermal-medium',
    displayName: 'Thermal Roll - Medium (60x71mm)',
    pageSizeMM: { width: 60, height: 71 },
    labelSizeMM: { width: 60, height: 71 },
    rows: 1,
    cols: 1,
    labelsPerPage: 1,
    paddingMM: 0,
    printType: 'roll',
  },
  'thermal-large': {
    name: 'thermal-large',
    displayName: 'Thermal Roll - Large (100x150mm)',
    pageSizeMM: { width: 100, height: 150 },
    labelSizeMM: { width: 100, height: 150 },
    rows: 1,
    cols: 1,
    labelsPerPage: 1,
    paddingMM: 0,
    printType: 'roll',
  },
};

// Utility functions
export const mmToPx = (mm: number, dpi: number = 96) => mm * (dpi / 25.4);
export const pxToMm = (px: number, dpi: number = 96) => px / (dpi / 25.4);

export const getMediaTypeConfig = (mediaTypeName: string): MediaTypeConfig => {
  return mediaTypes[mediaTypeName] || mediaTypes['a4-medium'];
};

export const calculateLabelDimensions = (mediaType: MediaTypeConfig, zoom: number = 100) => {
  const labelWidthPx = (mmToPx(mediaType.labelSizeMM.width) * zoom) / 100;
  const labelHeightPx = (mmToPx(mediaType.labelSizeMM.height) * zoom) / 100;
  const pageWidthPx = (mmToPx(mediaType.pageSizeMM.width) * zoom) / 100;
  const pageHeightPx = (mmToPx(mediaType.pageSizeMM.height) * zoom) / 100;

  return {
    label: { width: labelWidthPx, height: labelHeightPx },
    page: { width: pageWidthPx, height: pageHeightPx },
    grid: { rows: mediaType.rows, cols: mediaType.cols },
    labelsPerPage: mediaType.labelsPerPage,
  };
};

export default mediaTypes;
