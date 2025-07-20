'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import { ProductTemplate, LabelElement } from './LabelCanvas';
import { mediaTypes, getMediaTypeConfig, MediaTypeConfig } from '../../config/MediaTypeConfig';

// Dynamic imports to prevent SSR issues with Konva
const LabelCanvas = dynamic(() => import('./LabelCanvas'), { ssr: false });
const PrintLayout = dynamic(() => import('./PrintLayout'), { ssr: false });

interface Product {
  id: string;
  name: string;
  selling_price: number;
  unit: string;
  category?: string;
  sku?: string;
  description?: string;
}

interface TemplateControllerProps {
  onTemplateChange?: (template: ProductTemplate) => void;
}

export default function TemplateController({ onTemplateChange }: TemplateControllerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string>('a4-medium');
  const [currentTemplate, setCurrentTemplate] = useState<ProductTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'design' | 'print'>('design');
  const [zoom, setZoom] = useState(100);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);

  const mediaConfig = getMediaTypeConfig(selectedMediaType);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      generateTemplateForProduct(selectedProduct);
    }
  }, [selectedProduct, selectedMediaType]);

  const fetchProducts = async () => {
    try {
      // Use mock data for initial testing to avoid API errors
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Organic Tomatoes',
          selling_price: 45.0,
          unit: 'kg',
          category: 'Vegetables',
          sku: 'ORG-TOM-001',
        },
        {
          id: '2',
          name: 'Organic Onions',
          selling_price: 35.0,
          unit: 'kg',
          category: 'Vegetables',
          sku: 'ORG-ONI-002',
        },
        {
          id: '3',
          name: 'Organic Potatoes',
          selling_price: 32.0,
          unit: 'kg',
          category: 'Vegetables',
          sku: 'ORG-POT-003',
        },
        {
          id: '4',
          name: 'Organic Bananas',
          selling_price: 55.0,
          unit: 'dozen',
          category: 'Fruits',
          sku: 'ORG-BAN-004',
        },
        {
          id: '5',
          name: 'Organic Turmeric Powder',
          selling_price: 185.0,
          unit: 'kg',
          category: 'Spices',
          sku: 'ORG-TUR-005',
        },
      ];

      setProducts(mockProducts);
      console.log('✅ Loaded', mockProducts.length, 'products for template system');
      toast.success(`Loaded ${mockProducts.length} products successfully`);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    }
  };

  const generateTemplateForProduct = (product: Product) => {
    const template: ProductTemplate = {
      id: `template-${product.id}-${Date.now()}`,
      name: `${product.name} Label`,
      productId: product.id,
      mediaType: selectedMediaType,
      labelSize: {
        width: mediaConfig.labelSizeMM.width,
        height: mediaConfig.labelSizeMM.height,
      },
      elements: createDefaultElements(product, mediaConfig),
      createdAt: new Date().toISOString(),
    };

    setCurrentTemplate(template);
    onTemplateChange?.(template);
    toast.success(`Generated label template for ${product.name}`);
  };

  const createDefaultElements = (product: Product, config: MediaTypeConfig): LabelElement[] => {
    const elements: LabelElement[] = [];
    const labelWidth = config.labelSizeMM.width * 3.7795275591; // Convert mm to px
    const labelHeight = config.labelSizeMM.height * 3.7795275591;

    // 1. Product Name (grouped header)
    elements.push({
      id: `product-name-${Date.now()}`,
      type: 'text',
      x: 5,
      y: 5,
      width: labelWidth - 10,
      height: 20,
      content: product.name,
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: '#000000',
      groupId: 'header-group',
    });

    // 2. Price and Unit (grouped with header)
    elements.push({
      id: `price-unit-${Date.now()}`,
      type: 'text',
      x: 5,
      y: 28,
      width: labelWidth - 10,
      height: 16,
      content: `MRP: ₹${product.selling_price}/${product.unit}`,
      fontSize: 12,
      fontWeight: 'normal',
      fontFamily: 'Arial',
      color: '#333333',
      groupId: 'header-group',
    });

    // 3. QR Code (separate group)
    if (labelWidth > 100) {
      // Only add QR for larger labels
      elements.push({
        id: `qr-code-${Date.now()}`,
        type: 'qr',
        x: labelWidth - 35,
        y: 5,
        width: 30,
        height: 30,
        content: `https://leafyhealth.com/product/${product.id}`,
        groupId: 'qr-group',
      });
    }

    // 4. Indian Compliance (grouped together)
    if (labelHeight > 80) {
      // Only add for taller labels
      elements.push({
        id: `indian-compliance-${Date.now()}`,
        type: 'indian-compliance',
        x: 5,
        y: labelHeight - 35,
        width: labelWidth - 10,
        height: 30,
        content:
          'FSSAI License: 12345678901234\nMfd by: Sri Venkateswara Organic Foods\nBest Before: 12 months from MFD',
        fontSize: 8,
        groupId: 'compliance-group',
      });
    }

    // 5. Barcode (if space allows)
    if (labelWidth > 120 && labelHeight > 100) {
      elements.push({
        id: `barcode-${Date.now()}`,
        type: 'barcode',
        x: 5,
        y: labelHeight - 70,
        width: 80,
        height: 25,
        content: product.sku || '1234567890',
        groupId: 'barcode-group',
      });
    }

    return elements;
  };

  const handleElementSelect = (elementId: string) => {
    if (selectedElementIds.includes(elementId)) {
      setSelectedElementIds(selectedElementIds.filter(id => id !== elementId));
    } else {
      setSelectedElementIds([...selectedElementIds, elementId]);
    }
  };

  const handleElementUpdate = (elementId: string, updates: Partial<LabelElement>) => {
    if (!currentTemplate) return;

    const updatedElements = currentTemplate.elements.map(element =>
      element.id === elementId ? { ...element, ...updates } : element
    );

    const updatedTemplate = {
      ...currentTemplate,
      elements: updatedElements,
    };

    setCurrentTemplate(updatedTemplate);
    onTemplateChange?.(updatedTemplate);
  };

  const addNewElement = (type: LabelElement['type']) => {
    if (!currentTemplate) return;

    const newElement: LabelElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: 20,
      y: 20,
      width: type === 'qr' ? 30 : 100,
      height: type === 'qr' ? 30 : 20,
      content: type === 'text' ? 'New Text' : type === 'qr' ? 'https://example.com' : '',
      fontSize: 12,
      fontFamily: 'Arial',
      color: '#000000',
    };

    const updatedTemplate = {
      ...currentTemplate,
      elements: [...currentTemplate.elements, newElement],
    };

    setCurrentTemplate(updatedTemplate);
    onTemplateChange?.(updatedTemplate);
    toast.success(`Added ${type} element`);
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Template Controller</h2>

        {/* Product Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
            <select
              value={selectedProduct?.id || ''}
              onChange={e => {
                const product = products.find(p => p.id === e.target.value);
                setSelectedProduct(product || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a product...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ₹{product.selling_price}/{product.unit}
                </option>
              ))}
            </select>
            {products.length > 0 && (
              <p className="text-sm text-green-600 mt-1">✅ {products.length} products loaded</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
            <select
              value={selectedMediaType}
              onChange={e => setSelectedMediaType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.values(mediaTypes).map(type => (
                <option key={type.name} value={type.name}>
                  {type.displayName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('design')}
                className={`flex-1 px-3 py-2 rounded-md ${
                  viewMode === 'design' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Design
              </button>
              <button
                onClick={() => setViewMode('print')}
                className={`flex-1 px-3 py-2 rounded-md ${
                  viewMode === 'print' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Print Layout
              </button>
            </div>
          </div>
        </div>

        {/* Element Tools */}
        {currentTemplate && viewMode === 'design' && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm font-medium text-gray-700">Add Elements:</span>
            <button
              onClick={() => addNewElement('text')}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
            >
              + Text
            </button>
            <button
              onClick={() => addNewElement('qr')}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
            >
              + QR Code
            </button>
            <button
              onClick={() => addNewElement('barcode')}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
            >
              + Barcode
            </button>
            <button
              onClick={() => addNewElement('indian-compliance')}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
            >
              + Compliance
            </button>
          </div>
        )}
      </div>

      {/* Template Display */}
      {currentTemplate && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {viewMode === 'design' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Label Design - {currentTemplate.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Zoom:</span>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={zoom}
                    onChange={e => setZoom(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">{zoom}%</span>
                </div>
              </div>

              <LabelCanvas
                template={currentTemplate}
                mediaConfig={mediaConfig}
                zoom={zoom}
                showBorder={true}
                onElementSelect={handleElementSelect}
                onElementUpdate={handleElementUpdate}
                selectedElementIds={selectedElementIds}
                isEditable={true}
              />

              <div className="text-sm text-gray-600">
                Selected elements: {selectedElementIds.length} | Total elements:{' '}
                {currentTemplate.elements.length} | Grouped elements:{' '}
                {new Set(currentTemplate.elements.map(e => e.groupId).filter(Boolean)).size} groups
              </div>
            </div>
          ) : (
            <PrintLayout
              template={currentTemplate}
              mediaConfig={mediaConfig}
              zoom={50}
              showGrid={true}
              showPageBorder={true}
            />
          )}
        </div>
      )}

      {/* Status */}
      {!selectedProduct && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            👆 Select a product above to generate a label template automatically
          </p>
        </div>
      )}
    </div>
  );
}
