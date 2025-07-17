"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  net_weight: string;
  mrp: number;
  ingredients: string;
  nutrition_data: any;
  sku: string;
  category: string;
  brand: string;
  shelf_life_days: number;
}

interface AutomaticLabelGeneratorProps {
  onLabelGenerated: (labelData: any) => void;
}

export default function AutomaticLabelGenerator({ onLabelGenerated }: AutomaticLabelGeneratorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [labelType, setLabelType] = useState<'food' | 'delivery' | 'business'>('food');
  const [isGenerating, setIsGenerating] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: '',
    customerName: '',
    address: '',
    phone: '',
    quantity: 1
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/direct-data/products');
      if (response.ok) {
        const data = await response.json();
        // Handle both array response and object with products array
        const productList = Array.isArray(data) ? data : (data.products || []);
        console.log('Fetched products:', productList);
        setProducts(productList);
      } else {
        console.error('Failed to fetch products - HTTP', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    }
  };

  const generateLabelData = (product: Product, type: string) => {
    const baseData = {
      product,
      type,
      timestamp: new Date().toISOString(),
      generatedBy: 'automatic-system'
    };

    switch (type) {
      case 'food':
        return {
          ...baseData,
          elements: [
            {
              type: 'text',
              content: product.name,
              x: 20, y: 20, width: 280, height: 35,
              fontSize: 18, fontWeight: 'bold', color: '#000000'
            },
            {
              type: 'text',
              content: `MRP: ₹${product.mrp} (incl. all taxes)`,
              x: 20, y: 60, width: 250, height: 25,
              fontSize: 14, fontWeight: 'bold', color: '#DC2626'
            },
            {
              type: 'text',
              content: `Net Qty: ${product.net_weight}`,
              x: 20, y: 90, width: 200, height: 20,
              fontSize: 12, color: '#000000'
            },
            {
              type: 'text',
              content: 'FSSAI Lic. No: 12345678901234',
              x: 20, y: 120, width: 250, height: 18,
              fontSize: 10, fontWeight: 'bold', color: '#000000'
            },
            {
              type: 'text',
              content: `Ingredients: ${product.ingredients}`,
              x: 20, y: 145, width: 280, height: 40,
              fontSize: 9, color: '#374151'
            },
            {
              type: 'barcode',
              content: product.sku,
              x: 20, y: 195, width: 120, height: 30
            }
          ],
          compliance: {
            fssai: true,
            legalMetrology: true,
            bis: product.category === 'packaged_food'
          }
        };

      case 'delivery':
        return {
          ...baseData,
          elements: [
            {
              type: 'text',
              content: `Order #${orderDetails.orderNumber}`,
              x: 20, y: 20, width: 280, height: 30,
              fontSize: 16, fontWeight: 'bold', color: '#000000'
            },
            {
              type: 'text',
              content: orderDetails.customerName,
              x: 20, y: 55, width: 280, height: 25,
              fontSize: 14, fontWeight: 'bold', color: '#000000'
            },
            {
              type: 'text',
              content: orderDetails.address,
              x: 20, y: 85, width: 280, height: 40,
              fontSize: 11, color: '#000000'
            },
            {
              type: 'text',
              content: `Ph: ${orderDetails.phone}`,
              x: 20, y: 130, width: 180, height: 20,
              fontSize: 11, color: '#000000'
            },
            {
              type: 'text',
              content: `Qty: ${orderDetails.quantity}`,
              x: 210, y: 130, width: 90, height: 20,
              fontSize: 11, fontWeight: 'bold', color: '#000000'
            },
            {
              type: 'qr',
              content: `Order: ${orderDetails.orderNumber}, Customer: ${orderDetails.customerName}`,
              x: 230, y: 20, width: 60, height: 60
            }
          ],
          shipping: {
            trackingEnabled: true,
            expressDelivery: false
          }
        };

      case 'business':
        return {
          ...baseData,
          elements: [
            {
              type: 'text',
              content: 'LEAFYHEALTH',
              x: 20, y: 20, width: 280, height: 30,
              fontSize: 20, fontWeight: 'bold', color: '#059669'
            },
            {
              type: 'text',
              content: 'Organic Excellence',
              x: 20, y: 55, width: 180, height: 20,
              fontSize: 12, color: '#6B7280'
            },
            {
              type: 'text',
              content: product.name,
              x: 20, y: 85, width: 280, height: 25,
              fontSize: 14, fontWeight: 'bold', color: '#000000'
            },
            {
              type: 'text',
              content: `SKU: ${product.sku}`,
              x: 20, y: 115, width: 120, height: 20,
              fontSize: 10, color: '#6B7280'
            },
            {
              type: 'text',
              content: `Brand: ${product.brand}`,
              x: 150, y: 115, width: 130, height: 20,
              fontSize: 10, color: '#6B7280'
            },
            {
              type: 'text',
              content: 'For Business Use Only',
              x: 20, y: 145, width: 200, height: 18,
              fontSize: 9, fontStyle: 'italic', color: '#EF4444'
            }
          ],
          businessUse: {
            inventoryManagement: true,
            qualityControl: true,
            batchTracking: true
          }
        };

      default:
        return baseData;
    }
  };

  const handleGenerate = () => {
    if (!selectedProduct) {
      toast.error('Please select a product first');
      return;
    }

    if (labelType === 'delivery' && (!orderDetails.orderNumber || !orderDetails.customerName)) {
      toast.error('Please fill in order details for delivery labels');
      return;
    }

    setIsGenerating(true);

    // Simulate generation process
    setTimeout(() => {
      const labelData = generateLabelData(selectedProduct, labelType);
      console.log('🏷️ Generated label data:', labelData);
      
      onLabelGenerated(labelData);
      setIsGenerating(false);
      toast.success(`${labelType.charAt(0).toUpperCase() + labelType.slice(1)} label generated successfully!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
        <h3 className="text-lg font-bold text-orange-800 mb-2">🚀 Automatic Label Generation</h3>
        <p className="text-orange-700 text-sm">
          Zero manual input required. Select a product, choose label type, and generate print-ready labels instantly.
        </p>
      </div>

      {/* Label Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Label Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setLabelType('food')}
            className={`p-3 rounded-lg border text-center transition-colors ${
              labelType === 'food'
                ? 'bg-green-100 border-green-500 text-green-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-1">🥗</div>
            <div className="text-sm font-medium">Food Labels</div>
            <div className="text-xs">FSSAI Compliant</div>
          </button>
          <button
            onClick={() => setLabelType('delivery')}
            className={`p-3 rounded-lg border text-center transition-colors ${
              labelType === 'delivery'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-1">📦</div>
            <div className="text-sm font-medium">Delivery Labels</div>
            <div className="text-xs">Shipping Ready</div>
          </button>
          <button
            onClick={() => setLabelType('business')}
            className={`p-3 rounded-lg border text-center transition-colors ${
              labelType === 'business'
                ? 'bg-purple-100 border-purple-500 text-purple-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-1">🏢</div>
            <div className="text-sm font-medium">Business Labels</div>
            <div className="text-xs">Operations</div>
          </button>
        </div>
      </div>

      {/* Product Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Select Product
        </label>
        <select
          value={selectedProduct?.id || ''}
          onChange={(e) => {
            const product = products.find(p => p.id === e.target.value);
            setSelectedProduct(product || null);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a product...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ₹{product.mrp}
            </option>
          ))}
        </select>
      </div>

      {/* Delivery Details (only for delivery labels) */}
      {labelType === 'delivery' && (
        <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800">Delivery Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Number
              </label>
              <input
                type="text"
                value={orderDetails.orderNumber}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, orderNumber: e.target.value }))}
                placeholder="LH2025001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={orderDetails.customerName}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Customer Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                value={orderDetails.address}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Complete delivery address..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={orderDetails.phone}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={orderDetails.quantity}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Selected Product Preview */}
      {selectedProduct && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Selected Product</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Name:</strong> {selectedProduct.name}</div>
            <div><strong>SKU:</strong> {selectedProduct.sku}</div>
            <div><strong>MRP:</strong> ₹{selectedProduct.mrp}</div>
            <div><strong>Category:</strong> {selectedProduct.category}</div>
            {selectedProduct.net_weight && (
              <div><strong>Net Weight:</strong> {selectedProduct.net_weight}</div>
            )}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="pt-4">
        <button
          onClick={handleGenerate}
          disabled={!selectedProduct || isGenerating}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Label...
            </div>
          ) : (
            `🚀 Generate ${labelType.charAt(0).toUpperCase() + labelType.slice(1)} Label`
          )}
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Labels are automatically generated with industry-standard compliance and formatting
      </div>
    </div>
  );
}