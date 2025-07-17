"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface PrintManagerProps {
  mediaTemplate: {
    id: number;
    name: string;
    dimensions: {
      labelWidth: number;
      labelHeight: number;
    };
  };
  designTemplate: {
    id: number;
    name: string;
    templateJson: {
      elements: any[];
      labelSettings: any;
    };
  };
  selectedProducts?: any[];
}

export function PrintManager({ mediaTemplate, designTemplate, selectedProducts = [] }: PrintManagerProps) {
  const [printSettings, setPrintSettings] = useState({
    copies: 1,
    quality: 'high',
    colorMode: 'color',
    printerName: 'Default Printer'
  });
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      
      // Simulate print job creation
      const printJob = {
        mediaTemplate,
        designTemplate,
        products: selectedProducts,
        settings: printSettings,
        timestamp: new Date().toISOString()
      };
      
      // Mock API call for print job
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Print job created successfully! ${printSettings.copies} copies will be printed.`);
      
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to create print job');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Print Settings */}
      <div className="w-1/3 bg-gray-50 border-r p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Print Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Copies
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={printSettings.copies}
              onChange={(e) => setPrintSettings({...printSettings, copies: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Print Quality
            </label>
            <select
              value={printSettings.quality}
              onChange={(e) => setPrintSettings({...printSettings, quality: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="high">High Quality</option>
              <option value="medium">Medium Quality</option>
              <option value="draft">Draft Quality</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Mode
            </label>
            <select
              value={printSettings.colorMode}
              onChange={(e) => setPrintSettings({...printSettings, colorMode: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="color">Color</option>
              <option value="grayscale">Grayscale</option>
              <option value="blackwhite">Black & White</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Printer
            </label>
            <select
              value={printSettings.printerName}
              onChange={(e) => setPrintSettings({...printSettings, printerName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Default Printer">Default Printer</option>
              <option value="Label Printer 1">Label Printer 1</option>
              <option value="Label Printer 2">Label Printer 2</option>
            </select>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Print Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Media: {mediaTemplate.name}</p>
            <p>Template: {designTemplate.name}</p>
            <p>Products: {selectedProducts.length}</p>
            <p>Total Labels: {printSettings.copies}</p>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Preview and Print */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Print Preview</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              {isPreviewMode ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        
        {isPreviewMode && (
          <div className="bg-white border rounded-lg p-8 mb-6">
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Label Preview</h4>
                  <p className="text-gray-600 mb-4">
                    {mediaTemplate.name} - {mediaTemplate.dimensions.labelWidth}×{mediaTemplate.dimensions.labelHeight}mm
                  </p>
                  <div className="bg-gray-100 rounded p-4 text-sm text-gray-600">
                    <p>Template: {designTemplate.name}</p>
                    <p>Elements: {designTemplate.templateJson.elements.length}</p>
                    <p>This will show the actual label preview when the canvas renderer is integrated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Ready to Print</h4>
          <p className="text-gray-600 mb-6">
            Review your settings and click Print to create the print job. The labels will be sent to {printSettings.printerName}.
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className={`px-6 py-3 rounded-lg font-medium ${
                isPrinting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isPrinting ? 'Creating Print Job...' : `Print ${printSettings.copies} Labels`}
            </button>
            
            <button
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => window.location.reload()}
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}