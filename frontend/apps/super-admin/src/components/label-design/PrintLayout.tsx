'use client';

import React from 'react';
import LabelCanvas, { ProductTemplate } from './LabelCanvas';
import { MediaTypeConfig, calculateLabelDimensions } from '../../config/MediaTypeConfig';

interface PrintLayoutProps {
  template: ProductTemplate;
  mediaConfig: MediaTypeConfig;
  zoom?: number;
  showGrid?: boolean;
  showPageBorder?: boolean;
}

export default function PrintLayout({
  template,
  mediaConfig,
  zoom = 50, // Default smaller zoom for print layout view
  showGrid = true,
  showPageBorder = true,
}: PrintLayoutProps) {
  const dimensions = calculateLabelDimensions(mediaConfig, zoom);

  // For thermal roll, just show single label
  if (mediaConfig.printType === 'roll') {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">{mediaConfig.displayName}</h3>
          <p className="text-sm text-gray-600">Single label per roll</p>
        </div>

        <div className="relative">
          <LabelCanvas
            template={template}
            mediaConfig={mediaConfig}
            zoom={zoom}
            showBorder={true}
            isEditable={false}
          />
        </div>
      </div>
    );
  }

  // For sheet printing, show grid layout
  const renderLabelGrid = () => {
    const labels = [];

    for (let row = 0; row < mediaConfig.rows; row++) {
      for (let col = 0; col < mediaConfig.cols; col++) {
        const labelIndex = row * mediaConfig.cols + col;
        labels.push(
          <div
            key={`label-${labelIndex}`}
            className="relative"
            style={{
              gridRow: row + 1,
              gridColumn: col + 1,
            }}
          >
            <LabelCanvas
              template={template}
              mediaConfig={mediaConfig}
              zoom={zoom}
              showBorder={showGrid}
              isEditable={false}
            />

            {/* Label number indicator */}
            {showGrid && (
              <div className="absolute -top-2 -left-2 bg-gray-800 text-white text-xs px-1 rounded">
                {labelIndex + 1}
              </div>
            )}
          </div>
        );
      }
    }

    return labels;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Header info */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">{mediaConfig.displayName}</h3>
        <p className="text-sm text-gray-600">
          {mediaConfig.labelsPerPage} labels per page ({mediaConfig.rows}×{mediaConfig.cols} grid)
        </p>
      </div>

      {/* Print layout container */}
      <div
        className={`relative bg-white ${showPageBorder ? 'border-2 border-gray-400 shadow-lg' : ''}`}
        style={{
          width: dimensions.page.width,
          height: dimensions.page.height,
          aspectRatio: `${mediaConfig.pageSizeMM.width} / ${mediaConfig.pageSizeMM.height}`,
        }}
      >
        {/* Grid container */}
        <div
          className="absolute inset-0 p-2"
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${mediaConfig.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${mediaConfig.cols}, 1fr)`,
            gap: showGrid ? '4px' : '0px',
          }}
        >
          {renderLabelGrid()}
        </div>

        {/* Page size indicator */}
        {showPageBorder && (
          <div className="absolute top-1 right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded">
            A4 ({mediaConfig.pageSizeMM.width}×{mediaConfig.pageSizeMM.height}mm)
          </div>
        )}
      </div>

      {/* Export actions */}
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Export PDF
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Export PNG
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Print Preview
        </button>
      </div>
    </div>
  );
}
