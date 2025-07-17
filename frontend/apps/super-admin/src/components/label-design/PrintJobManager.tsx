
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { LabelTemplate, calculateLabelsPerSheet } from '../../config/LabelTemplateConfig';

interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
  barcode?: string;
}

interface ProductPrintRequest {
  product: Product;
  quantity: number;
}

interface PrintJobManagerProps {
  template: LabelTemplate;
  availableProducts: Product[];
  onPrintJobCreate: (printRequests: ProductPrintRequest[]) => void;
}

export function PrintJobManager({ template, availableProducts, onPrintJobCreate }: PrintJobManagerProps) {
  const [printRequests, setPrintRequests] = useState<ProductPrintRequest[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const labelsPerSheet = calculateLabelsPerSheet(template);
  const totalRequestedLabels = printRequests.reduce((sum, req) => sum + req.quantity, 0);
  const sheetsNeeded = template.mediaType === 'sheet' 
    ? Math.ceil(totalRequestedLabels / labelsPerSheet)
    : Math.ceil(totalRequestedLabels); // For rolls, each label is separate

  const addProductToPrintJob = () => {
    if (!selectedProductId) return;
    
    const product = availableProducts.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingIndex = printRequests.findIndex(req => req.product.id === selectedProductId);
    
    if (existingIndex >= 0) {
      // Update existing quantity
      const updated = [...printRequests];
      updated[existingIndex].quantity += quantity;
      setPrintRequests(updated);
    } else {
      // Add new product
      setPrintRequests(prev => [...prev, { product, quantity }]);
    }

    setQuantity(1);
    setSelectedProductId(null);
  };

  const removeProductFromPrintJob = (productId: number) => {
    setPrintRequests(prev => prev.filter(req => req.product.id !== productId));
  };

  const updateProductQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProductFromPrintJob(productId);
      return;
    }

    setPrintRequests(prev => prev.map(req => 
      req.product.id === productId 
        ? { ...req, quantity: newQuantity }
        : req
    ));
  };

  const generateOptimalLayout = (): ProductPrintRequest[] => {
    if (template.mediaType === 'roll') {
      // For rolls, order doesn't matter much - just print in sequence
      return printRequests;
    }

    // For sheets, optimize to minimize waste
    const optimized: ProductPrintRequest[] = [];
    let remainingRequests = [...printRequests];

    while (remainingRequests.length > 0 && remainingRequests.some(req => req.quantity > 0)) {
      const currentSheet: ProductPrintRequest[] = [];
      let availableSlots = labelsPerSheet;

      // Fill current sheet
      for (const request of remainingRequests) {
        if (request.quantity > 0 && availableSlots > 0) {
          const takeQuantity = Math.min(request.quantity, availableSlots);
          
          const existingInSheet = currentSheet.find(item => item.product.id === request.product.id);
          if (existingInSheet) {
            existingInSheet.quantity += takeQuantity;
          } else {
            currentSheet.push({ product: request.product, quantity: takeQuantity });
          }

          request.quantity -= takeQuantity;
          availableSlots -= takeQuantity;
        }
      }

      // Add current sheet items to optimized list
      for (const item of currentSheet) {
        const existing = optimized.find(opt => opt.product.id === item.product.id);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          optimized.push({ ...item });
        }
      }

      // Remove completed requests
      remainingRequests = remainingRequests.filter(req => req.quantity > 0);
    }

    return optimized;
  };

  const renderPrintPreview = () => {
    if (printRequests.length === 0) return null;

    const optimizedLayout = generateOptimalLayout();

    return (
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Print Layout Preview</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-600">Template</div>
            <div className="font-medium">{template.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Labels</div>
            <div className="font-medium">{totalRequestedLabels}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">
              {template.mediaType === 'sheet' ? 'Sheets Needed' : 'Roll Length'}
            </div>
            <div className="font-medium">
              {template.mediaType === 'sheet' 
                ? `${sheetsNeeded} sheets` 
                : `${totalRequestedLabels} labels`}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Efficiency</div>
            <div className="font-medium">
              {template.mediaType === 'sheet' 
                ? `${Math.round((totalRequestedLabels / (sheetsNeeded * labelsPerSheet)) * 100)}%`
                : '100%'}
            </div>
          </div>
        </div>

        {template.mediaType === 'sheet' && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Sheet Layout Simulation</div>
            {Array.from({ length: sheetsNeeded }).map((_, sheetIndex) => (
              <div key={sheetIndex} className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Sheet {sheetIndex + 1}</div>
                <div 
                  className="grid gap-1 border border-gray-300 p-2 bg-gray-50"
                  style={{
                    gridTemplateColumns: `repeat(${template.columns}, 1fr)`,
                    gridTemplateRows: `repeat(${template.rows}, 1fr)`
                  }}
                >
                  {Array.from({ length: labelsPerSheet }).map((_, labelIndex) => {
                    const globalLabelIndex = sheetIndex * labelsPerSheet + labelIndex;
                    const assignedProduct = getProductForLabelIndex(globalLabelIndex, optimizedLayout);
                    
                    return (
                      <div
                        key={labelIndex}
                        className="border border-gray-400 bg-white text-xs p-1 flex items-center justify-center"
                        style={{
                          aspectRatio: `${template.labelDimensions.width} / ${template.labelDimensions.height}`,
                          minHeight: '30px'
                        }}
                      >
                        {assignedProduct ? (
                          <div className="text-center">
                            <div className="font-medium truncate">{assignedProduct.name}</div>
                            <div className="text-xs text-gray-500">{assignedProduct.sku}</div>
                          </div>
                        ) : (
                          <div className="text-gray-400">Empty</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <Button 
          onClick={() => onPrintJobCreate(optimizedLayout)}
          className="w-full"
          disabled={totalRequestedLabels === 0}
        >
          🖨️ Create Print Job ({totalRequestedLabels} labels)
        </Button>
      </Card>
    );
  };

  const getProductForLabelIndex = (labelIndex: number, layout: ProductPrintRequest[]): Product | null => {
    let currentIndex = 0;
    
    for (const request of layout) {
      if (labelIndex >= currentIndex && labelIndex < currentIndex + request.quantity) {
        return request.product;
      }
      currentIndex += request.quantity;
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Multi-Product Print Job</h3>
        
        {/* Add Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Product</label>
            <select
              value={selectedProductId || ''}
              onChange={(e) => setSelectedProductId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Choose a product...</option>
              {availableProducts.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.sku}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={addProductToPrintJob}
              disabled={!selectedProductId}
              className="w-full"
            >
              ➕ Add to Job
            </Button>
          </div>
        </div>

        {/* Current Print Requests */}
        {printRequests.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Print Queue</h4>
            <div className="space-y-2">
              {printRequests.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{request.product.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({request.product.sku})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={request.quantity}
                      onChange={(e) => updateProductQuantity(request.product.id, parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <Badge variant="outline">{request.quantity} labels</Badge>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeProductFromPrintJob(request.product.id)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {renderPrintPreview()}
    </div>
  );
}
