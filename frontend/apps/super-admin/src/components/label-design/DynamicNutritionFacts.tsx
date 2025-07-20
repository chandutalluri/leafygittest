import React from 'react';

interface NutritionData {
  energy_kcal?: number;
  protein?: number;
  total_fat?: number;
  saturated_fat?: number;
  trans_fat?: number;
  carbohydrates?: number;
  total_sugars?: number;
  dietary_fiber?: number;
  sodium?: number;
}

interface DynamicNutritionFactsProps {
  width: number;
  height: number;
  nutritionData?: NutritionData;
}

const DynamicNutritionFacts: React.FC<DynamicNutritionFactsProps> = ({
  width,
  height,
  nutritionData,
}) => {
  if (!nutritionData) {
    return (
      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center text-xs text-gray-500">
          <div className="w-6 h-6 mx-auto mb-1 border border-gray-400"></div>
          <div>Nutrition Facts</div>
          <div className="text-xs">Add nutrition data</div>
        </div>
      </div>
    );
  }

  // Calculate scaling factor based on available space
  const targetWidth = 280;
  const targetHeight = 360;
  const scaleX = width / targetWidth;
  const scaleY = height / targetHeight;
  const scaleFactor = Math.min(scaleX, scaleY, 1.2); // Allow slight upscaling

  // Calculate font sizes based on scale
  const baseFontSize = Math.max(5, Math.min(18, 10 * scaleFactor));
  const titleFontSize = Math.max(8, baseFontSize * 1.5);
  const headerFontSize = Math.max(6, baseFontSize * 1.1);
  const smallFontSize = Math.max(4, baseFontSize * 0.8);
  const energyFontSize = Math.max(8, baseFontSize * 1.3);

  // Calculate spacing and padding
  const padding = Math.max(3, 6 * scaleFactor);
  const borderWidth = Math.max(1, 2 * scaleFactor);
  const lineSpacing = Math.max(2, 3 * scaleFactor);

  // Nutrition row data
  const nutritionRows = [
    {
      label: 'Protein',
      value: nutritionData.protein || 0,
      unit: 'g',
      rda: Math.round(((nutritionData.protein || 0) / 50) * 100),
      bold: true,
      indent: false,
      borderStyle: 'solid',
    },
    {
      label: 'Total Fat',
      value: nutritionData.total_fat || 0,
      unit: 'g',
      rda: Math.round(((nutritionData.total_fat || 0) / 65) * 100),
      bold: true,
      indent: false,
      borderStyle: 'solid',
    },
    {
      label: 'Saturated Fat',
      value: nutritionData.saturated_fat || 0,
      unit: 'g',
      rda: null,
      bold: true,
      indent: true,
      borderStyle: 'light',
    },
    {
      label: 'Trans Fat',
      value: nutritionData.trans_fat || 0,
      unit: 'g',
      rda: null,
      bold: false,
      indent: true,
      borderStyle: 'light',
    },
    {
      label: 'Total Carbohydrate',
      value: nutritionData.carbohydrates || 0,
      unit: 'g',
      rda: Math.round(((nutritionData.carbohydrates || 0) / 300) * 100),
      bold: true,
      indent: false,
      borderStyle: 'solid',
    },
    {
      label: 'Total Sugars',
      value: nutritionData.total_sugars || 0,
      unit: 'g',
      rda: null,
      bold: true,
      indent: true,
      borderStyle: 'light',
    },
    {
      label: 'Dietary Fiber',
      value: nutritionData.dietary_fiber || 0,
      unit: 'g',
      rda: null,
      bold: false,
      indent: true,
      borderStyle: 'light',
    },
    {
      label: 'Salt',
      value: Math.round((nutritionData.sodium || 0) * 2.54 || 0),
      unit: 'mg',
      rda: null,
      bold: true,
      indent: false,
      borderStyle: 'solid',
    },
  ];

  return (
    <div
      className="w-full h-full bg-white text-black flex flex-col"
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        border: `${Math.max(2, borderWidth * 2)}px solid black`,
        padding: `${padding}px`,
        fontSize: `${baseFontSize}px`,
        lineHeight: '1.1',
        boxSizing: 'border-box',
      }}
    >
      {/* TITLE */}
      <div
        className="text-center font-black uppercase tracking-wide"
        style={{
          fontSize: `${titleFontSize}px`,
          fontWeight: '900',
          fontFamily: 'Arial Black, Helvetica, sans-serif',
          borderBottom: `${Math.max(2, borderWidth * 2)}px solid black`,
          paddingBottom: `${Math.max(2, lineSpacing)}px`,
          marginBottom: `${Math.max(2, lineSpacing)}px`,
        }}
      >
        NUTRITION FACTS
      </div>

      {/* PER 100G DECLARATION */}
      <div
        style={{
          borderBottom: '1px solid black',
          paddingBottom: `${Math.max(1, lineSpacing / 2)}px`,
          marginBottom: `${Math.max(1, lineSpacing / 2)}px`,
        }}
      >
        <div style={{ fontSize: `${headerFontSize}px`, fontWeight: 'bold' }}>Per 100g</div>
        <div style={{ fontSize: `${smallFontSize}px`, fontStyle: 'italic' }}>
          As per FSSAI standards
        </div>
      </div>

      {/* ENERGY SECTION */}
      <div
        className="flex justify-between items-center font-black"
        style={{
          fontSize: `${energyFontSize}px`,
          fontWeight: '900',
          borderBottom: `${Math.max(2, borderWidth * 2)}px solid black`,
          paddingBottom: `${Math.max(1, lineSpacing / 2)}px`,
          marginBottom: `${Math.max(1, lineSpacing / 2)}px`,
          backgroundColor: '#f8f8f8',
          padding: `${Math.max(1, lineSpacing / 2)}px ${Math.max(1, lineSpacing / 2)}px`,
        }}
      >
        <span>Energy</span>
        <span>{nutritionData.energy_kcal || 0} kcal</span>
      </div>

      {/* RDA HEADER */}
      <div
        className="text-right font-bold"
        style={{
          fontSize: `${smallFontSize}px`,
          marginBottom: `${Math.max(1, lineSpacing / 2)}px`,
        }}
      >
        % RDA*
      </div>

      {/* NUTRIENTS TABLE */}
      <div className="flex-1 flex flex-col">
        {nutritionRows.map((row, index) => {
          const borderColor = row.borderStyle === 'solid' ? '#666' : '#ccc';
          const borderWidth = row.borderStyle === 'solid' ? '1px' : '0.5px';
          const indentPadding = row.indent ? Math.max(6, 10 * scaleFactor) : 0;

          return (
            <div
              key={row.label}
              className="flex justify-between items-center"
              style={{
                fontSize: `${baseFontSize}px`,
                fontWeight: row.bold ? '900' : 'normal',
                borderTop: `${borderWidth} solid ${borderColor}`,
                paddingTop: `${Math.max(1, lineSpacing / 3)}px`,
                paddingBottom: `${Math.max(1, lineSpacing / 3)}px`,
                paddingLeft: `${indentPadding}px`,
                flex: index === nutritionRows.length - 1 ? 'none' : '1',
                minHeight: `${Math.max(12, baseFontSize * 1.4)}px`,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>{row.label}</span>
              <span>
                {row.value}
                {row.unit}
                {row.rda !== null && ` (${row.rda}%)`}
              </span>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div
        style={{
          fontSize: `${Math.max(3, smallFontSize * 0.85)}px`,
          borderTop: `${Math.max(1, borderWidth)}px solid black`,
          paddingTop: `${Math.max(1, lineSpacing / 2)}px`,
          marginTop: `${Math.max(1, lineSpacing / 2)}px`,
          lineHeight: '1.2',
        }}
      >
        * RDA based on 2000 kcal diet per Indian standards
      </div>
    </div>
  );
};

export default DynamicNutritionFacts;
