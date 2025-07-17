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

interface NutritionFactsTemplateProps {
  width: number;
  height: number;
  nutritionData?: NutritionData;
  templateType: 'standard' | 'tall-bottle' | 'wide-bag' | 'compact-square' | 'mini-sachet';
}

const NutritionFactsTemplates: React.FC<NutritionFactsTemplateProps> = ({ 
  width, 
  height, 
  nutritionData,
  templateType = 'standard'
}) => {
  if (!nutritionData) {
    return (
      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center text-xs text-gray-500">
          <div className="w-6 h-6 mx-auto mb-1 border border-gray-400"></div>
          <div>Nutrition Facts</div>
          <div className="text-xs">{templateType} template</div>
        </div>
      </div>
    );
  }

  // Calculate scaling factor based on template type and available space
  const getScalingFactors = () => {
    switch (templateType) {
      case 'tall-bottle':
        // For bottles - optimize for height over width
        return {
          targetWidth: 200,
          targetHeight: 450,
          fontMultiplier: 0.9,
          paddingMultiplier: 0.8
        };
      case 'wide-bag':
        // For large bags - optimize for width
        return {
          targetWidth: 400,
          targetHeight: 280,
          fontMultiplier: 1.1,
          paddingMultiplier: 1.2
        };
      case 'compact-square':
        // For small square packages
        return {
          targetWidth: 250,
          targetHeight: 250,
          fontMultiplier: 0.8,
          paddingMultiplier: 0.7
        };
      case 'mini-sachet':
        // For very small sachets
        return {
          targetWidth: 180,
          targetHeight: 200,
          fontMultiplier: 0.7,
          paddingMultiplier: 0.6
        };
      default: // standard
        return {
          targetWidth: 280,
          targetHeight: 360,
          fontMultiplier: 1.0,
          paddingMultiplier: 1.0
        };
    }
  };

  const { targetWidth, targetHeight, fontMultiplier, paddingMultiplier } = getScalingFactors();
  const scaleX = width / targetWidth;
  const scaleY = height / targetHeight;
  const scaleFactor = Math.min(scaleX, scaleY, 1.3);

  // Calculate responsive font sizes
  const baseFontSize = Math.max(4, Math.min(20, 10 * scaleFactor * fontMultiplier));
  const titleFontSize = Math.max(7, baseFontSize * 1.4);
  const headerFontSize = Math.max(5, baseFontSize * 1.0);
  const smallFontSize = Math.max(3, baseFontSize * 0.75);
  const energyFontSize = Math.max(6, baseFontSize * 1.2);

  // Calculate spacing and padding
  const padding = Math.max(2, 6 * scaleFactor * paddingMultiplier);
  const borderWidth = Math.max(1, 2 * scaleFactor);
  const lineSpacing = Math.max(1, 3 * scaleFactor);

  // Nutrition data with FSSAI-compliant calculations
  const nutritionRows = [
    { 
      label: 'Protein', 
      value: nutritionData.protein || 0, 
      unit: 'g', 
      rda: Math.round(((nutritionData.protein || 0) / 50) * 100),
      bold: true,
      indent: false,
      mandatory: true
    },
    { 
      label: 'Total Fat', 
      value: nutritionData.total_fat || 0, 
      unit: 'g', 
      rda: Math.round(((nutritionData.total_fat || 0) / 65) * 100),
      bold: true,
      indent: false,
      mandatory: true
    },
    { 
      label: 'Saturated Fat', 
      value: nutritionData.saturated_fat || 0, 
      unit: 'g', 
      rda: null,
      bold: true,
      indent: true,
      mandatory: true
    },
    { 
      label: 'Trans Fat', 
      value: nutritionData.trans_fat || 0, 
      unit: 'g', 
      rda: null,
      bold: false,
      indent: true,
      mandatory: true
    },
    { 
      label: 'Total Carbohydrate', 
      value: nutritionData.carbohydrates || 0, 
      unit: 'g', 
      rda: Math.round(((nutritionData.carbohydrates || 0) / 300) * 100),
      bold: true,
      indent: false,
      mandatory: true
    },
    { 
      label: 'Total Sugars', 
      value: nutritionData.total_sugars || 0, 
      unit: 'g', 
      rda: null,
      bold: true,
      indent: true,
      mandatory: true
    },
    { 
      label: 'Dietary Fibre', 
      value: nutritionData.dietary_fiber || 0, 
      unit: 'g', 
      rda: null,
      bold: false,
      indent: true,
      mandatory: false
    },
    { 
      label: 'Salt', 
      value: Math.round(((nutritionData.sodium || 0) * 2.54) || 0), 
      unit: 'mg', 
      rda: null,
      bold: true,
      indent: false,
      mandatory: true
    }
  ];

  // Template-specific layout adjustments
  const getLayoutStyles = () => {
    switch (templateType) {
      case 'tall-bottle':
        return {
          containerClass: 'flex flex-col',
          titleClass: 'text-center font-black uppercase tracking-tight',
          energyLayout: 'flex flex-col items-center',
          nutrientLayout: 'flex flex-col space-y-1'
        };
      case 'wide-bag':
        return {
          containerClass: 'flex flex-col',
          titleClass: 'text-center font-black uppercase tracking-wide',
          energyLayout: 'flex justify-between items-center',
          nutrientLayout: 'grid grid-cols-2 gap-x-4 gap-y-1'
        };
      case 'compact-square':
        return {
          containerClass: 'flex flex-col',
          titleClass: 'text-center font-black uppercase',
          energyLayout: 'flex justify-between items-center',
          nutrientLayout: 'flex flex-col space-y-0.5'
        };
      case 'mini-sachet':
        return {
          containerClass: 'flex flex-col',
          titleClass: 'text-center font-black uppercase text-xs',
          energyLayout: 'flex justify-between items-center',
          nutrientLayout: 'flex flex-col space-y-0.5'
        };
      default:
        return {
          containerClass: 'flex flex-col',
          titleClass: 'text-center font-black uppercase tracking-wide',
          energyLayout: 'flex justify-between items-center',
          nutrientLayout: 'flex flex-col'
        };
    }
  };

  const layoutStyles = getLayoutStyles();

  return (
    <div 
      className={`w-full h-full bg-white text-black ${layoutStyles.containerClass}`}
      style={{ 
        fontFamily: 'Arial, Helvetica, sans-serif',
        border: `${Math.max(2, borderWidth * 2)}px solid black`,
        padding: `${padding}px`,
        fontSize: `${baseFontSize}px`,
        lineHeight: templateType === 'mini-sachet' ? '1.0' : '1.1',
        boxSizing: 'border-box'
      }}
    >
      {/* TITLE */}
      <div 
        className={layoutStyles.titleClass}
        style={{ 
          fontSize: `${titleFontSize}px`,
          fontWeight: '900',
          fontFamily: 'Arial Black, Helvetica, sans-serif',
          borderBottom: `${Math.max(2, borderWidth * 2)}px solid black`,
          paddingBottom: `${Math.max(1, lineSpacing/2)}px`,
          marginBottom: `${Math.max(1, lineSpacing/2)}px`
        }}
      >
        NUTRITION FACTS
      </div>
      
      {/* PER 100G DECLARATION - FSSAI Mandatory */}
      <div 
        style={{ 
          borderBottom: '1px solid black',
          paddingBottom: `${Math.max(1, lineSpacing/3)}px`,
          marginBottom: `${Math.max(1, lineSpacing/3)}px`
        }}
      >
        <div style={{ fontSize: `${headerFontSize}px`, fontWeight: 'bold' }}>
          Per 100g
        </div>
        {templateType !== 'mini-sachet' && (
          <div style={{ fontSize: `${smallFontSize}px`, fontStyle: 'italic' }}>
            As per FSSAI standards
          </div>
        )}
      </div>
      
      {/* ENERGY SECTION */}
      <div 
        className={`font-black ${layoutStyles.energyLayout}`}
        style={{ 
          fontSize: `${energyFontSize}px`,
          fontWeight: '900',
          borderBottom: `${Math.max(1, borderWidth)}px solid black`,
          paddingBottom: `${Math.max(1, lineSpacing/2)}px`,
          marginBottom: `${Math.max(1, lineSpacing/2)}px`,
          backgroundColor: templateType === 'wide-bag' ? '#f5f5f5' : '#f8f8f8',
          padding: `${Math.max(1, lineSpacing/3)}px ${Math.max(1, lineSpacing/3)}px`
        }}
      >
        <span>Energy</span>
        <span>{nutritionData.energy_kcal || 0} kcal</span>
      </div>
      
      {/* RDA HEADER */}
      {templateType !== 'mini-sachet' && (
        <div 
          className="text-right font-bold"
          style={{ 
            fontSize: `${smallFontSize}px`,
            marginBottom: `${Math.max(1, lineSpacing/3)}px`
          }}
        >
          % RDA*
        </div>
      )}
      
      {/* NUTRIENTS SECTION */}
      <div className="flex-1">
        <div className={layoutStyles.nutrientLayout}>
          {nutritionRows.map((row, index) => {
            // Skip dietary fiber for mini-sachet to save space
            if (templateType === 'mini-sachet' && !row.mandatory) return null;
            
            const borderColor = row.bold ? '#666' : '#ccc';
            const borderWidth = row.bold ? '1px' : '0.5px';
            const indentPadding = row.indent ? Math.max(3, 6 * scaleFactor) : 0;
            
            return (
              <div 
                key={row.label}
                className="flex justify-between items-center"
                style={{ 
                  fontSize: `${Math.max(3, baseFontSize * 0.95)}px`,
                  fontWeight: row.bold ? '900' : 'normal',
                  borderTop: templateType === 'wide-bag' && index % 2 === 0 ? 'none' : `${borderWidth} solid ${borderColor}`,
                  paddingTop: `${Math.max(0.5, lineSpacing/4)}px`,
                  paddingBottom: `${Math.max(0.5, lineSpacing/4)}px`,
                  paddingLeft: `${indentPadding}px`,
                  minHeight: `${Math.max(8, baseFontSize * 1.2)}px`,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span>{row.label}</span>
                <span>
                  {row.value}{row.unit}
                  {row.rda !== null && templateType !== 'mini-sachet' && ` (${row.rda}%)`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* FOOTER - FSSAI Disclaimer */}
      {templateType !== 'mini-sachet' && (
        <div 
          style={{ 
            fontSize: `${Math.max(2, smallFontSize * 0.8)}px`,
            borderTop: `${Math.max(1, borderWidth)}px solid black`,
            paddingTop: `${Math.max(1, lineSpacing/3)}px`,
            marginTop: `${Math.max(1, lineSpacing/3)}px`,
            lineHeight: '1.1'
          }}
        >
          * RDA based on 2000 kcal diet per Indian standards
        </div>
      )}
    </div>
  );
};

export default NutritionFactsTemplates;