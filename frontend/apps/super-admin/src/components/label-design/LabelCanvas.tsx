"use client";

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Group, Text, Rect, Image } from 'react-konva';
import { MediaTypeConfig } from '../../config/MediaTypeConfig';

export interface LabelElement {
  id: string;
  type: 'text' | 'qr' | 'barcode' | 'image' | 'nutrition-table' | 'indian-compliance';
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
  isEditable = true
}: LabelCanvasProps) {
  const stageRef = useRef<any>(null);
  
  // Calculate canvas dimensions based on media config and zoom
  const canvasWidth = (mediaConfig.labelSizeMM.width * 3.7795275591) * zoom / 100;
  const canvasHeight = (mediaConfig.labelSizeMM.height * 3.7795275591) * zoom / 100;

  const renderElement = (element: LabelElement) => {
    const isSelected = selectedElementIds.includes(element.id);
    const scaleFactor = zoom / 100;
    
    const elementProps = {
      key: element.id,
      x: element.x * scaleFactor,
      y: element.y * scaleFactor,
      width: element.width * scaleFactor,
      height: element.height * scaleFactor,
      draggable: isEditable,
      onClick: () => onElementSelect?.(element.id),
      onDragEnd: (e: any) => {
        if (onElementUpdate) {
          onElementUpdate(element.id, {
            x: e.target.x() / scaleFactor,
            y: e.target.y() / scaleFactor
          });
        }
      }
    };

    switch (element.type) {
      case 'text':
        return (
          <Group {...elementProps}>
            <Text
              text={element.content || 'Text'}
              fontSize={(element.fontSize || 12) * scaleFactor}
              fontFamily={element.fontFamily || 'Arial'}
              fontStyle={element.fontWeight || 'normal'}
              fill={element.color || '#000000'}
              width={element.width * scaleFactor}
              height={element.height * scaleFactor}
              align="left"
              verticalAlign="top"
            />
            {isSelected && (
              <Rect
                width={element.width * scaleFactor}
                height={element.height * scaleFactor}
                stroke="#0066ff"
                strokeWidth={2}
                dash={[5, 5]}
                fill="transparent"
              />
            )}
          </Group>
        );
        
      case 'qr':
        return (
          <Group {...elementProps}>
            <Rect
              width={element.width * scaleFactor}
              height={element.height * scaleFactor}
              fill="#000000"
              cornerRadius={2}
            />
            <Text
              text="QR"
              fontSize={12 * scaleFactor}
              fill="#ffffff"
              width={element.width * scaleFactor}
              height={element.height * scaleFactor}
              align="center"
              verticalAlign="middle"
            />
            {isSelected && (
              <Rect
                width={element.width * scaleFactor}
                height={element.height * scaleFactor}
                stroke="#0066ff"
                strokeWidth={2}
                dash={[5, 5]}
                fill="transparent"
              />
            )}
          </Group>
        );
        
      case 'barcode':
        return (
          <Group {...elementProps}>
            <Rect
              width={element.width * scaleFactor}
              height={element.height * scaleFactor}
              fill="#ffffff"
              stroke="#000000"
              strokeWidth={1}
            />
            {/* Barcode lines */}
            {Array.from({ length: 20 }, (_, i) => (
              <Rect
                key={i}
                x={(i * 2 + 1) * scaleFactor}
                y={5 * scaleFactor}
                width={1 * scaleFactor}
                height={(element.height - 10) * scaleFactor}
                fill="#000000"
              />
            ))}
            {isSelected && (
              <Rect
                width={element.width * scaleFactor}
                height={element.height * scaleFactor}
                stroke="#0066ff"
                strokeWidth={2}
                dash={[5, 5]}
                fill="transparent"
              />
            )}
          </Group>
        );
        
      case 'nutrition-table':
        return (
          <Group {...elementProps}>
            <Rect
              width={element.width * scaleFactor}
              height={element.height * scaleFactor}
              fill="#f8f9fa"
              stroke="#dee2e6"
              strokeWidth={1}
            />
            <Text
              text="Nutrition Facts"
              fontSize={10 * scaleFactor}
              fontStyle="bold"
              fill="#000000"
              x={5 * scaleFactor}
              y={5 * scaleFactor}
              width={(element.width - 10) * scaleFactor}
            />
            {isSelected && (
              <Rect
                width={element.width * scaleFactor}
                height={element.height * scaleFactor}
                stroke="#0066ff"
                strokeWidth={2}
                dash={[5, 5]}
                fill="transparent"
              />
            )}
          </Group>
        );
        
      case 'indian-compliance':
        return (
          <Group {...elementProps}>
            <Rect
              width={element.width * scaleFactor}
              height={element.height * scaleFactor}
              fill="#fff8dc"
              stroke="#d4c5a9"
              strokeWidth={1}
            />
            <Text
              text="FSSAI License: 12345678901234\nMfd by: Company Name\nPacked Date: DD/MM/YYYY"
              fontSize={8 * scaleFactor}
              fill="#000000"
              x={3 * scaleFactor}
              y={3 * scaleFactor}
              width={(element.width - 6) * scaleFactor}
              height={(element.height - 6) * scaleFactor}
            />
            {isSelected && (
              <Rect
                width={element.width * scaleFactor}
                height={element.height * scaleFactor}
                stroke="#0066ff"
                strokeWidth={2}
                dash={[5, 5]}
                fill="transparent"
              />
            )}
          </Group>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <Stage
        ref={stageRef}
        width={canvasWidth}
        height={canvasHeight}
        className={showBorder ? "border-2 border-gray-300 rounded-lg" : ""}
      >
        <Layer>
          {/* Label background */}
          <Rect
            width={canvasWidth}
            height={canvasHeight}
            fill="#ffffff"
            stroke={showBorder ? "#e5e7eb" : "transparent"}
            strokeWidth={1}
          />
          
          {/* Render all template elements */}
          {template.elements.map(renderElement)}
        </Layer>
      </Stage>
      
      {/* Label info overlay */}
      {showBorder && (
        <div className="absolute top-1 left-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {mediaConfig.labelSizeMM.width}×{mediaConfig.labelSizeMM.height}mm
        </div>
      )}
    </div>
  );
}