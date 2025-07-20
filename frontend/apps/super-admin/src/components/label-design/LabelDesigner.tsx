'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface LabelDesignerProps {
  mediaTemplate: {
    id: number;
    name: string;
    dimensions: {
      labelWidth: number;
      labelHeight: number;
    };
  };
  onSave: (elements: any[]) => void;
}

export function LabelDesigner({ mediaTemplate, onSave }: LabelDesignerProps) {
  const [elements, setElements] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('text');
  const [isSaving, setIsSaving] = useState(false);

  const tools = [
    { id: 'text', name: 'Text', icon: '📝' },
    { id: 'barcode', name: 'Barcode', icon: '🏷️' },
    { id: 'qrcode', name: 'QR Code', icon: '📱' },
    { id: 'image', name: 'Image', icon: '🖼️' },
    { id: 'rectangle', name: 'Rectangle', icon: '▭' },
    { id: 'nutrition', name: 'Nutrition Facts', icon: '🥗' },
  ];

  const addElement = () => {
    const newElement = {
      id: Date.now().toString(),
      type: selectedTool,
      x: 50,
      y: 50,
      width: 100,
      height: 30,
      content: selectedTool === 'text' ? 'Sample Text' : `Sample ${selectedTool}`,
      fontSize: 12,
      color: '#000000',
      backgroundColor: 'transparent',
    };

    setElements([...elements, newElement]);
    toast.success(`${selectedTool} element added`);
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    toast.success('Element removed');
  };

  const handleSave = async () => {
    if (elements.length === 0) {
      toast.error('Please add at least one element to your label design');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(elements);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex">
      {/* Left Toolbar */}
      <div className="w-64 bg-gray-50 border-r p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Tools</h3>

        <div className="space-y-2 mb-6">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`w-full flex items-center p-3 rounded-lg border transition-colors ${
                selectedTool === tool.id
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tool.icon}</span>
              {tool.name}
            </button>
          ))}
        </div>

        <button
          onClick={addElement}
          className="w-full py-2 px-4 bg-emerald-600 text-white rounded hover:bg-emerald-700 mb-4"
        >
          Add {selectedTool} Element
        </button>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Elements ({elements.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {elements.map(element => (
              <div
                key={element.id}
                className="flex items-center justify-between p-2 bg-white rounded border"
              >
                <span className="text-sm">{element.type}</span>
                <button
                  onClick={() => removeElement(element.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 p-6">
        <div className="bg-white border rounded-lg h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Label Canvas</h3>
              <div className="text-sm text-gray-600">
                {mediaTemplate.dimensions.labelWidth} × {mediaTemplate.dimensions.labelHeight}mm
              </div>
            </div>
          </div>

          <div className="p-8 flex items-center justify-center h-full">
            <div
              className="border-2 border-dashed border-gray-300 bg-white relative"
              style={{
                width: `${mediaTemplate.dimensions.labelWidth * 2}px`,
                height: `${mediaTemplate.dimensions.labelHeight * 2}px`,
                minWidth: '400px',
                minHeight: '300px',
              }}
            >
              <div className="absolute inset-0 p-2">
                <div className="text-center text-gray-500 text-sm mb-4">Label Design Area</div>

                {/* Render Elements */}
                {elements.map(element => (
                  <div
                    key={element.id}
                    className="absolute border border-blue-300 bg-blue-50 p-2 cursor-move"
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                      fontSize: `${element.fontSize}px`,
                      color: element.color,
                    }}
                  >
                    {element.content}
                  </div>
                ))}

                {elements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <p className="mb-2">No elements added yet</p>
                      <p className="text-sm">
                        Select a tool from the left panel and click "Add Element"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Elements: {elements.length} | Selected Tool: {selectedTool}
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isSaving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Design & Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
