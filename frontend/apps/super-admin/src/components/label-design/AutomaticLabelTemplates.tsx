"use client";

import React, { useState, useEffect } from 'react';

// Food Label Templates
export const FOOD_LABEL_TEMPLATES = {
  'premium_organic': {
    name: 'Premium Organic',
    description: 'Professional design for premium organic products with green accents',
    category: 'food',
    elements: [
      {
        type: 'rectangle',
        x: 0, y: 0, width: 320, height: 8,
        backgroundColor: '#22C55E', // Green header
        borderWidth: 0
      },
      {
        type: 'text',
        content: 'ORGANIC',
        x: 20, y: 20, width: 100, height: 20,
        fontSize: 12, fontWeight: 'bold', color: '#22C55E'
      },
      {
        type: 'text',
        content: '{{PRODUCT_NAME}}',
        x: 20, y: 45, width: 280, height: 35,
        fontSize: 18, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'text',
        content: '{{MRP}}',
        x: 20, y: 85, width: 180, height: 25,
        fontSize: 14, fontWeight: 'bold', color: '#DC2626'
      },
      {
        type: 'text',
        content: '{{NET_QUANTITY}}',
        x: 20, y: 115, width: 150, height: 20,
        fontSize: 12, color: '#000000'
      },
      {
        type: 'text',
        content: '{{FSSAI_LICENSE}}',
        x: 20, y: 145, width: 250, height: 18,
        fontSize: 10, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'barcode',
        content: '{{SKU}}',
        x: 200, y: 85, width: 100, height: 40
      }
    ]
  },
  'traditional_ayurvedic': {
    name: 'Traditional Ayurvedic',
    description: 'Traditional design with earthy colors for ayurvedic products',
    category: 'food',
    elements: [
      {
        type: 'rectangle',
        x: 0, y: 0, width: 320, height: 8,
        backgroundColor: '#D97706', // Orange header
        borderWidth: 0
      },
      {
        type: 'text',
        content: 'आयुर्वेदिक AYURVEDIC',
        x: 20, y: 20, width: 200, height: 20,
        fontSize: 11, fontWeight: 'bold', color: '#D97706'
      },
      {
        type: 'text',
        content: '{{PRODUCT_NAME}}',
        x: 20, y: 45, width: 280, height: 35,
        fontSize: 16, fontWeight: 'bold', color: '#92400E'
      },
      {
        type: 'text',
        content: '{{MRP}}',
        x: 20, y: 85, width: 180, height: 25,
        fontSize: 14, fontWeight: 'bold', color: '#DC2626'
      },
      {
        type: 'text',
        content: '{{MANUFACTURER}}',
        x: 20, y: 115, width: 280, height: 20,
        fontSize: 10, color: '#78350F'
      },
      {
        type: 'text',
        content: '{{FSSAI_LICENSE}}',
        x: 20, y: 140, width: 250, height: 18,
        fontSize: 9, fontWeight: 'bold', color: '#000000'
      }
    ]
  },
  'modern_minimalist': {
    name: 'Modern Minimalist',
    description: 'Clean, modern design with minimal elements',
    category: 'food',
    elements: [
      {
        type: 'rectangle',
        x: 0, y: 0, width: 320, height: 4,
        backgroundColor: '#000000', // Black header
        borderWidth: 0
      },
      {
        type: 'text',
        content: '{{PRODUCT_NAME}}',
        x: 20, y: 20, width: 280, height: 40,
        fontSize: 20, fontWeight: '300', color: '#000000'
      },
      {
        type: 'text',
        content: '{{MRP}}',
        x: 20, y: 70, width: 200, height: 30,
        fontSize: 16, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'text',
        content: '{{NET_QUANTITY}}',
        x: 20, y: 105, width: 150, height: 20,
        fontSize: 11, color: '#6B7280'
      },
      {
        type: 'qr',
        content: '{{PRODUCT_NAME}} - {{SKU}}',
        x: 240, y: 70, width: 60, height: 60
      }
    ]
  },
  'premium_heritage': {
    name: 'Premium Heritage',
    description: 'Elegant design for premium heritage products',
    category: 'food',
    elements: [
      {
        type: 'rectangle',
        x: 0, y: 0, width: 320, height: 8,
        backgroundColor: '#7C2D12', // Brown header
        borderWidth: 0
      },
      {
        type: 'text',
        content: 'HERITAGE QUALITY',
        x: 20, y: 20, width: 150, height: 18,
        fontSize: 10, fontWeight: 'bold', color: '#7C2D12'
      },
      {
        type: 'text',
        content: '{{PRODUCT_NAME}}',
        x: 20, y: 45, width: 280, height: 35,
        fontSize: 17, fontWeight: 'bold', color: '#451A03'
      },
      {
        type: 'text',
        content: '{{MRP}}',
        x: 20, y: 85, width: 180, height: 25,
        fontSize: 14, fontWeight: 'bold', color: '#DC2626'
      },
      {
        type: 'text',
        content: 'Since 1985',
        x: 210, y: 20, width: 90, height: 18,
        fontSize: 10, fontStyle: 'italic', color: '#7C2D12'
      }
    ]
  }
};

// Delivery Label Templates
export const DELIVERY_LABEL_TEMPLATES = {
  'express_delivery': {
    name: 'Express Delivery',
    description: 'High-priority express delivery with red accents',
    category: 'delivery',
    elements: [
      {
        type: 'rectangle',
        x: 0, y: 0, width: 320, height: 8,
        backgroundColor: '#DC2626', // Red header
        borderWidth: 0
      },
      {
        type: 'text',
        content: 'EXPRESS DELIVERY',
        x: 20, y: 20, width: 150, height: 20,
        fontSize: 12, fontWeight: 'bold', color: '#DC2626'
      },
      {
        type: 'text',
        content: 'Order #{{ORDER_NUMBER}}',
        x: 20, y: 45, width: 200, height: 25,
        fontSize: 14, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'text',
        content: '{{CUSTOMER_NAME}}',
        x: 20, y: 75, width: 200, height: 20,
        fontSize: 12, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'text',
        content: '{{DELIVERY_ADDRESS}}',
        x: 20, y: 100, width: 280, height: 40,
        fontSize: 10, color: '#000000'
      },
      {
        type: 'qr',
        content: 'Order: {{ORDER_NUMBER}}',
        x: 240, y: 20, width: 60, height: 60
      }
    ]
  },
  'standard_shipping': {
    name: 'Standard Shipping',
    description: 'Regular shipping label with blue theme',
    category: 'delivery',
    elements: [
      {
        type: 'rectangle',
        x: 0, y: 0, width: 320, height: 6,
        backgroundColor: '#2563EB', // Blue header
        borderWidth: 0
      },
      {
        type: 'text',
        content: 'LEAFYHEALTH DELIVERY',
        x: 20, y: 20, width: 200, height: 18,
        fontSize: 11, fontWeight: 'bold', color: '#2563EB'
      },
      {
        type: 'text',
        content: '{{CUSTOMER_NAME}}',
        x: 20, y: 45, width: 200, height: 22,
        fontSize: 13, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'text',
        content: '{{DELIVERY_ADDRESS}}',
        x: 20, y: 72, width: 280, height: 45,
        fontSize: 10, color: '#000000'
      },
      {
        type: 'text',
        content: 'Ph: {{PHONE}}',
        x: 20, y: 125, width: 150, height: 18,
        fontSize: 10, color: '#6B7280'
      }
    ]
  },
  'same_day_delivery': {
    name: 'Same Day Delivery',
    description: 'Urgent same-day delivery with yellow alerts',
    category: 'delivery',
    elements: [
      {
        type: 'rectangle',
        x: 0, y: 0, width: 320, height: 8,
        backgroundColor: '#EAB308', // Yellow header
        borderWidth: 0
      },
      {
        type: 'text',
        content: '⚡ SAME DAY DELIVERY',
        x: 20, y: 20, width: 180, height: 20,
        fontSize: 12, fontWeight: 'bold', color: '#92400E'
      },
      {
        type: 'text',
        content: 'URGENT',
        x: 220, y: 20, width: 60, height: 20,
        fontSize: 11, fontWeight: 'bold', color: '#DC2626'
      },
      {
        type: 'text',
        content: '{{CUSTOMER_NAME}}',
        x: 20, y: 50, width: 200, height: 22,
        fontSize: 13, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'text',
        content: '{{DELIVERY_ADDRESS}}',
        x: 20, y: 77, width: 280, height: 45,
        fontSize: 10, color: '#000000'
      }
    ]
  }
};

// Business Operation Labels
export const BUSINESS_LABEL_TEMPLATES = {
  'inventory_management': {
    name: 'Inventory Management',
    description: 'Internal inventory tracking labels',
    category: 'business',
    elements: [
      {
        type: 'rectangle',
        x: 0, y: 0, width: 320, height: 6,
        backgroundColor: '#7C3AED', // Purple header
        borderWidth: 0
      },
      {
        type: 'text',
        content: 'INVENTORY',
        x: 20, y: 20, width: 100, height: 18,
        fontSize: 11, fontWeight: 'bold', color: '#7C3AED'
      },
      {
        type: 'text',
        content: '{{PRODUCT_NAME}}',
        x: 20, y: 45, width: 200, height: 25,
        fontSize: 14, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'text',
        content: 'SKU: {{SKU}}',
        x: 20, y: 75, width: 120, height: 18,
        fontSize: 10, color: '#6B7280'
      },
      {
        type: 'text',
        content: 'Batch: {{BATCH_NUMBER}}',
        x: 20, y: 95, width: 150, height: 18,
        fontSize: 10, color: '#6B7280'
      },
      {
        type: 'text',
        content: 'Received: {{MFG_DATE}}',
        x: 20, y: 115, width: 150, height: 18,
        fontSize: 10, color: '#6B7280'
      },
      {
        type: 'barcode',
        content: '{{SKU}}',
        x: 200, y: 45, width: 100, height: 35
      }
    ]
  },
  'quality_control': {
    name: 'Quality Control',
    description: 'Quality control and testing labels',
    category: 'business',
    elements: [
      {
        type: 'rectangle',
        x: 0, y: 0, width: 320, height: 6,
        backgroundColor: '#059669', // Green header
        borderWidth: 0
      },
      {
        type: 'text',
        content: 'QUALITY CONTROL',
        x: 20, y: 20, width: 150, height: 18,
        fontSize: 11, fontWeight: 'bold', color: '#059669'
      },
      {
        type: 'text',
        content: '{{PRODUCT_NAME}}',
        x: 20, y: 45, width: 280, height: 25,
        fontSize: 14, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'text',
        content: 'Tested: ✓ Approved',
        x: 20, y: 75, width: 120, height: 18,
        fontSize: 10, fontWeight: 'bold', color: '#059669'
      },
      {
        type: 'text',
        content: 'Inspector: QC Team',
        x: 20, y: 95, width: 150, height: 18,
        fontSize: 10, color: '#6B7280'
      },
      {
        type: 'text',
        content: 'Date: {{MFG_DATE}}',
        x: 20, y: 115, width: 150, height: 18,
        fontSize: 10, color: '#6B7280'
      }
    ]
  },
  'storage_location': {
    name: 'Storage Location',
    description: 'Warehouse storage location labels',
    category: 'business',
    elements: [
      {
        type: 'rectangle',
        x: 0, y: 0, width: 320, height: 6,
        backgroundColor: '#0891B2', // Cyan header
        borderWidth: 0
      },
      {
        type: 'text',
        content: 'STORAGE',
        x: 20, y: 20, width: 100, height: 18,
        fontSize: 11, fontWeight: 'bold', color: '#0891B2'
      },
      {
        type: 'text',
        content: 'Aisle A | Rack 12 | Shelf 3',
        x: 130, y: 20, width: 170, height: 18,
        fontSize: 10, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'text',
        content: '{{PRODUCT_NAME}}',
        x: 20, y: 45, width: 280, height: 25,
        fontSize: 14, fontWeight: 'bold', color: '#000000'
      },
      {
        type: 'text',
        content: 'Temp: 18-25°C | Humidity: <60%',
        x: 20, y: 75, width: 200, height: 18,
        fontSize: 9, color: '#6B7280'
      },
      {
        type: 'text',
        content: 'Last Updated: {{MFG_DATE}}',
        x: 20, y: 95, width: 150, height: 18,
        fontSize: 9, color: '#6B7280'
      }
    ]
  }
};

interface AutomaticLabelTemplatesProps {
  onTemplateSelect: (template: any) => void;
  selectedCategory?: string;
}

export default function AutomaticLabelTemplates({ 
  onTemplateSelect, 
  selectedCategory = 'food' 
}: AutomaticLabelTemplatesProps) {
  const [activeCategory, setActiveCategory] = useState<'food' | 'delivery' | 'business'>(selectedCategory as 'food' | 'delivery' | 'business');
  const [databaseTemplates, setDatabaseTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatabaseTemplates();
  }, []);

  const fetchDatabaseTemplates = async () => {
    try {
      const response = await fetch('/api/labels/custom-templates');
      if (response.ok) {
        const data = await response.json();
        const templatesArray = Array.isArray(data) ? data : (data.templates || []);
        console.log('📊 Fetched database templates:', templatesArray.length);
        setDatabaseTemplates(templatesArray);
      }
    } catch (error) {
      console.error('Error fetching database templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTemplatesForCategory = () => {
    const staticTemplates = (() => {
      switch (activeCategory) {
        case 'food':
          return FOOD_LABEL_TEMPLATES;
        case 'delivery':
          return DELIVERY_LABEL_TEMPLATES;
        case 'business':
          return BUSINESS_LABEL_TEMPLATES;
        default:
          return FOOD_LABEL_TEMPLATES;
      }
    })();

    // Convert database templates to the same format
    const dbTemplatesByCategory = databaseTemplates
      .filter(template => template.category === activeCategory || !template.category)
      .reduce((acc, template) => {
        const key = `db_${template.id}`;
        acc[key] = {
          name: template.name || 'Database Template',
          description: template.description || 'Template from database',
          category: template.category || activeCategory,
          elements: template.template_data?.elements || []
        };
        return acc;
      }, {});

    return { ...staticTemplates, ...dbTemplatesByCategory };
  };

  const templates = getTemplatesForCategory();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-bold text-blue-800 mb-2">🎨 Professional Label Templates</h3>
        <p className="text-blue-700 text-sm">
          Industry-standard templates for all business needs. Professional designs with automatic compliance.
        </p>
      </div>

      {/* Category Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Template Category
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setActiveCategory('food')}
            className={`p-3 rounded-lg border text-center transition-colors ${
              activeCategory === 'food'
                ? 'bg-green-100 border-green-500 text-green-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-1">🥗</div>
            <div className="text-sm font-medium">Food Labels</div>
            <div className="text-xs">
              {Object.keys(FOOD_LABEL_TEMPLATES).length + databaseTemplates.filter(t => t.category === 'food' || !t.category).length} templates
            </div>
          </button>
          <button
            onClick={() => setActiveCategory('delivery')}
            className={`p-3 rounded-lg border text-center transition-colors ${
              activeCategory === 'delivery'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-1">📦</div>
            <div className="text-sm font-medium">Delivery</div>
            <div className="text-xs">
              {Object.keys(DELIVERY_LABEL_TEMPLATES).length + databaseTemplates.filter(t => t.category === 'delivery').length} templates
            </div>
          </button>
          <button
            onClick={() => setActiveCategory('business')}
            className={`p-3 rounded-lg border text-center transition-colors ${
              activeCategory === 'business'
                ? 'bg-purple-100 border-purple-500 text-purple-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-1">🏢</div>
            <div className="text-sm font-medium">Business</div>
            <div className="text-xs">
              {Object.keys(BUSINESS_LABEL_TEMPLATES).length + databaseTemplates.filter(t => t.category === 'business').length} templates
            </div>
          </button>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(templates).map(([key, template]) => (
          <div
            key={key}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => onTemplateSelect(template)}
          >
            {/* Template Preview */}
            <div className="bg-gray-50 rounded-lg mb-4 p-4 border">
              <div className="relative" style={{ width: '320px', height: '180px', transform: 'scale(0.8)', transformOrigin: 'top left' }}>
                {template.elements.map((element, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      backgroundColor: element.backgroundColor || 'transparent',
                      color: element.color || '#000000',
                      fontSize: `${element.fontSize}px`,
                      fontWeight: element.fontWeight || 'normal',
                      fontStyle: element.fontStyle || 'normal',
                      border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor || '#000'}` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    {element.type === 'text' && (
                      <span className="truncate px-1">
                        {element.content?.includes('{{') ? 
                          element.content.replace(/\{\{.*?\}\}/g, 'Sample Text') : 
                          element.content}
                      </span>
                    )}
                    {element.type === 'rectangle' && (
                      <div className="w-full h-full"></div>
                    )}
                    {element.type === 'barcode' && (
                      <div className="w-full h-full bg-black bg-opacity-10 flex items-center justify-center text-xs">
                        |||||||||||
                      </div>
                    )}
                    {element.type === 'qr' && (
                      <div className="w-full h-full bg-black bg-opacity-10 flex items-center justify-center text-xs">
                        QR
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Template Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {template.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTemplateSelect(template);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-2">
        <div className="text-sm text-gray-500">
          All templates include industry-standard compliance and professional formatting
        </div>
        <div className="flex items-center justify-center space-x-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
          <span className="text-gray-400">
            {loading ? 'Loading database templates...' : `${databaseTemplates.length} templates from database`}
          </span>
        </div>
      </div>
    </div>
  );
}