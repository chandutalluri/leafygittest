import React from 'react';
import { Group, Rect, Text } from 'react-konva';

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

interface KonvaNutritionTableProps {
  width: number;
  height: number;
  nutritionData?: NutritionData;
}

const KonvaNutritionTable: React.FC<KonvaNutritionTableProps> = ({ 
  width, 
  height, 
  nutritionData 
}) => {
  if (!nutritionData) {
    return (
      <Group>
        <Rect
          width={width}
          height={height}
          fill="white"
          stroke="#ccc"
          strokeWidth={2}
          dash={[5, 5]}
        />
        <Text
          x={width / 2}
          y={height / 2 - 10}
          text="Nutrition Facts"
          fontSize={12}
          fill="#666"
          align="center"
          width={width}
        />
        <Text
          x={width / 2}
          y={height / 2 + 10}
          text="Add nutrition data"
          fontSize={10}
          fill="#666"
          align="center"
          width={width}
        />
      </Group>
    );
  }

  // Calculate dynamic font sizes based on available space
  const scaleFactor = Math.min(width / 280, height / 360);
  const baseFontSize = Math.max(6, Math.min(16, 10 * scaleFactor));
  const titleSize = Math.max(8, baseFontSize * 1.4);
  const headerSize = Math.max(7, baseFontSize * 1.1);
  const smallSize = Math.max(5, baseFontSize * 0.8);
  
  // Calculate spacing and padding
  const padding = Math.max(4, 8 * scaleFactor);
  const rowHeight = Math.max(12, baseFontSize * 1.6);
  const borderWidth = Math.max(1, 2 * scaleFactor);
  
  // Define nutrition rows data
  const nutritionRows = [
    { 
      label: 'Protein', 
      value: `${nutritionData.protein || 0}g`, 
      percentage: `(${Math.round(((nutritionData.protein || 0) / 50) * 100)}%)`,
      bold: true,
      indent: false
    },
    { 
      label: 'Total Fat', 
      value: `${nutritionData.total_fat || 0}g`, 
      percentage: `(${Math.round(((nutritionData.total_fat || 0) / 65) * 100)}%)`,
      bold: true,
      indent: false
    },
    { 
      label: 'Saturated Fat', 
      value: `${nutritionData.saturated_fat || 0}g`, 
      percentage: '',
      bold: true,
      indent: true
    },
    { 
      label: 'Trans Fat', 
      value: `${nutritionData.trans_fat || 0}g`, 
      percentage: '',
      bold: false,
      indent: true
    },
    { 
      label: 'Total Carbohydrate', 
      value: `${nutritionData.carbohydrates || 0}g`, 
      percentage: `(${Math.round(((nutritionData.carbohydrates || 0) / 300) * 100)}%)`,
      bold: true,
      indent: false
    },
    { 
      label: 'Total Sugars', 
      value: `${nutritionData.total_sugars || 0}g`, 
      percentage: '',
      bold: true,
      indent: true
    },
    { 
      label: 'Dietary Fiber', 
      value: `${nutritionData.dietary_fiber || 0}g`, 
      percentage: '',
      bold: false,
      indent: true
    },
    { 
      label: 'Salt', 
      value: `${Math.round(((nutritionData.sodium || 0) * 2.54) || 0)}mg`, 
      percentage: '',
      bold: true,
      indent: false
    }
  ];

  let currentY = 0;

  return (
    <Group>
      {/* Main border */}
      <Rect
        width={width}
        height={height}
        fill="white"
        stroke="black"
        strokeWidth={borderWidth * 2}
      />
      
      {/* Title */}
      <Rect
        x={padding}
        y={padding}
        width={width - padding * 2}
        height={titleSize + padding}
        fill="white"
      />
      <Text
        x={padding}
        y={padding + padding/2}
        text="NUTRITION FACTS"
        fontSize={titleSize}
        fontFamily="Arial"
        fontStyle="bold"
        fill="black"
        align="center"
        width={width - padding * 2}
      />
      
      {/* Heavy line under title */}
      <Rect
        x={padding}
        y={padding + titleSize + padding}
        width={width - padding * 2}
        height={borderWidth * 2}
        fill="black"
      />
      
      {/* Per 100g declaration */}
      <Text
        x={padding}
        y={padding + titleSize + padding * 2 + borderWidth * 2}
        text="Per 100g"
        fontSize={headerSize}
        fontFamily="Arial"
        fontStyle="bold"
        fill="black"
        width={width - padding * 2}
      />
      
      <Text
        x={padding}
        y={padding + titleSize + padding * 2 + borderWidth * 2 + headerSize + 2}
        text="As per FSSAI standards"
        fontSize={smallSize}
        fontFamily="Arial"
        fontStyle="italic"
        fill="black"
        width={width - padding * 2}
      />
      
      {/* Line under per 100g */}
      <Rect
        x={padding}
        y={padding + titleSize + padding * 3 + borderWidth * 2 + headerSize + smallSize + 4}
        width={width - padding * 2}
        height={1}
        fill="black"
      />
      
      {/* Energy section with gray background */}
      {(() => {
        const energyY = padding + titleSize + padding * 4 + borderWidth * 2 + headerSize + smallSize + 6;
        const energyHeight = Math.max(20, baseFontSize * 2);
        
        return (
          <Group>
            <Rect
              x={padding}
              y={energyY}
              width={width - padding * 2}
              height={energyHeight}
              fill="#f8f8f8"
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={padding + 4}
              y={energyY + 4}
              text="Energy"
              fontSize={Math.max(8, baseFontSize * 1.2)}
              fontFamily="Arial"
              fontStyle="bold"
              fill="black"
            />
            <Text
              x={width - padding - 4}
              y={energyY + 4}
              text={`${nutritionData.energy_kcal || 0} kcal`}
              fontSize={Math.max(8, baseFontSize * 1.2)}
              fontFamily="Arial"
              fontStyle="bold"
              fill="black"
              align="right"
              width={100}
            />
          </Group>
        );
      })()}
      
      {/* % RDA header */}
      {(() => {
        const rdaY = padding + titleSize + padding * 5 + borderWidth * 2 + headerSize + smallSize + Math.max(20, baseFontSize * 2) + 10;
        
        return (
          <Text
            x={width - padding - 4}
            y={rdaY}
            text="% RDA*"
            fontSize={smallSize}
            fontFamily="Arial"
            fontStyle="bold"
            fill="black"
            align="right"
            width={60}
          />
        );
      })()}
      
      {/* Nutrition rows */}
      {(() => {
        let startY = padding + titleSize + padding * 6 + borderWidth * 2 + headerSize + smallSize + Math.max(20, baseFontSize * 2) + 25;
        const availableHeight = height - startY - padding - 20; // Reserve space for footer
        const dynamicRowHeight = Math.max(rowHeight, availableHeight / nutritionRows.length);
        
        return nutritionRows.map((row, index) => {
          const y = startY + index * dynamicRowHeight;
          const indentX = row.indent ? padding + 12 : padding + 4;
          const lineColor = row.bold ? 'black' : '#ccc';
          const lineWidth = row.bold ? 1 : 0.5;
          
          return (
            <Group key={row.label}>
              {/* Top border line */}
              <Rect
                x={padding}
                y={y}
                width={width - padding * 2}
                height={lineWidth}
                fill={lineColor}
              />
              
              {/* Row background */}
              <Rect
                x={padding}
                y={y + lineWidth}
                width={width - padding * 2}
                height={dynamicRowHeight - lineWidth}
                fill="white"
              />
              
              {/* Label text */}
              <Text
                x={indentX}
                y={y + lineWidth + 2}
                text={row.label}
                fontSize={baseFontSize}
                fontFamily="Arial"
                fontStyle={row.bold ? "bold" : "normal"}
                fill="black"
              />
              
              {/* Value text */}
              <Text
                x={width - padding - 4}
                y={y + lineWidth + 2}
                text={`${row.value} ${row.percentage}`}
                fontSize={baseFontSize}
                fontFamily="Arial"
                fontStyle={row.bold ? "bold" : "normal"}
                fill="black"
                align="right"
                width={120}
              />
            </Group>
          );
        });
      })()}
      
      {/* Footer disclaimer */}
      {(() => {
        const footerY = height - padding - 15;
        
        return (
          <Group>
            <Rect
              x={padding}
              y={footerY - 5}
              width={width - padding * 2}
              height={1}
              fill="black"
            />
            <Text
              x={padding}
              y={footerY}
              text="* RDA based on 2000 kcal diet per Indian standards"
              fontSize={Math.max(4, smallSize * 0.8)}
              fontFamily="Arial"
              fill="black"
              width={width - padding * 2}
            />
          </Group>
        );
      })()}
    </Group>
  );
};

export default KonvaNutritionTable;