'use client';

import React, { useRef, useEffect } from 'react';
import { MediaTypeConfig } from '../../config/MediaTypeConfig';

export interface LabelElement {
  id: string;
  type: 'text' | 'rectangle' | 'barcode' | 'nutritionTable' | 'logo';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  rotation?: number;
  groupId?: string;
}

export interface ProductTemplate {
  id: string;
  name: string;
  productId?: string;
  mediaType: string;
  elements: LabelElement[];
  labelSize: {
    width: number;
    height: number;
  };
  createdAt?: string;
}

interface LabelCanvasProps {
  template: ProductTemplate;
  mediaConfig: MediaTypeConfig;
  zoom?: number;
  showBorder?: boolean;
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: Partial<LabelElement>) => void;
  selectedElementIds?: string[];
  isEditable?: boolean;
}

export default function LabelCanvas({
  template,
  mediaConfig,
  zoom = 100,
  showBorder = true,
  onElementSelect,
  onElementUpdate,
  selectedElementIds = [],
  isEditable = true,
}: LabelCanvasProps) {
  // Calculate canvas dimensions based on media config and zoom
  const canvasWidth = (mediaConfig.labelSizeMM.width * 3.7795275591 * zoom) / 100;
  const canvasHeight = (mediaConfig.labelSizeMM.height * 3.7795275591 * zoom) / 100;

  const renderElement = (element: LabelElement) => {
    const isSelected = selectedElementIds.includes(element.id);
    const scaleFactor = zoom / 100;

    const elementStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x * scaleFactor,
      top: element.y * scaleFactor,
      width: element.width * scaleFactor,
      height: element.height * scaleFactor,
      cursor: isEditable ? 'move' : 'default',
      border: isSelected ? '2px solid #0066ff' : 'none',
      fontSize: (element.fontSize || 12) * scaleFactor,
      fontFamily: element.fontFamily || 'Arial',
      fontWeight: element.fontWeight || 'normal',
      color: element.color || '#000000',
      backgroundColor: element.backgroundColor || 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: element.type === 'text' ? 'flex-start' : 'center',
      padding: element.type === 'text' ? '2px' : '0',
      overflow: 'hidden',
      transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none',
    };

    const handleClick = () => {
      if (onElementSelect) {
        onElementSelect(element.id);
      }
    };

    switch (element.type) {
      case 'text':
        return (
          <div key={element.id} style={elementStyle} onClick={handleClick}>
            {element.content || 'Sample Text'}
          </div>
        );
      case 'rectangle':
        return (
          <div 
            key={element.id} 
            style={{
              ...elementStyle,
              border: '1px solid ' + (element.color || '#000000'),
              backgroundColor: element.backgroundColor || 'transparent',
            }} 
            onClick={handleClick}
          />
        );
      case 'barcode':
        return (
          <div key={element.id} style={elementStyle} onClick={handleClick}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'repeating-linear-gradient(to right, #000 0px, #000 2px, #fff 2px, #fff 4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '8px',
            }}>
              {element.content || '123456789'}
            </div>
          </div>
        );
      case 'nutritionTable':
        return (
          <div key={element.id} style={{
            ...elementStyle,
            border: '2px solid black',
            backgroundColor: 'white',
            padding: '4px',
            fontSize: '8px',
            textAlign: 'left',
            lineHeight: '1.2',
          }} onClick={handleClick}>
            <div style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '2px' }}>
              NUTRITION FACTS
            </div>
            <div style={{ borderTop: '1px solid black', paddingTop: '2px', fontSize: '6px' }}>
              Per 100g | Energy: 250 kcal<br />
              Protein: 12g | Fat: 15g<br />
              Carbs: 20g | Sugar: 5g
            </div>
          </div>
        );
      default:
        return (
          <div key={element.id} style={elementStyle} onClick={handleClick}>
            {element.type}
          </div>
        );
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <div
        style={{
          position: 'relative',
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: 'white',
          border: showBorder ? '1px solid #ddd' : 'none',
          margin: '0 auto',
          overflow: 'hidden',
        }}
      >
        {template.elements.map(renderElement)}
      </div>
      <div style={{
        textAlign: 'center',
        marginTop: '10px',
        fontSize: '12px',
        color: '#666',
      }}>
        {template.name} - {Math.round(canvasWidth)}×{Math.round(canvasHeight)}px ({zoom}%)
        <br />
        <em>Simplified HTML preview (react-konva not available)</em>
      </div>
    </div>
  );
}