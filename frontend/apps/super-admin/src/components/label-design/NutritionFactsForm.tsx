"use client";

import React, { useState, useEffect } from 'react';
import { BeakerIcon, GlobeAltIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface NutritionData {
  energy_kcal: number;
  protein: number;
  carbohydrates: number;
  total_fat: number;
  saturated_fat?: number;
  trans_fat?: number;
  dietary_fiber?: number;
  total_sugars?: number;
  sodium?: number;
  vitamin_c?: number;
  vitamin_a?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  serving_size: string;
  servings_per_container: number;
}

interface NutritionTemplate {
  category: string;
  required_fields: string[];
  optional_fields: string[];
}

interface NutritionFactsFormProps {
  productName: string;
  category: string;
  onNutritionData: (data: NutritionData | null) => void;
  onClose: () => void;
}

const NutritionFactsForm: React.FC<NutritionFactsFormProps> = ({
  productName,
  category,
  onNutritionData,
  onClose
}) => {
  const [nutritionData, setNutritionData] = useState<Partial<NutritionData>>({
    serving_size: '100g',
    servings_per_container: 1
  });
  const [template, setTemplate] = useState<NutritionTemplate | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Field labels and units following Indian FSSAI standards
  const fieldLabels = {
    energy_kcal: 'Energy (kcal)',
    protein: 'Protein (g)',
    carbohydrates: 'Total Carbohydrates (g)',
    total_fat: 'Total Fat (g)',
    saturated_fat: 'Saturated Fat (g)',
    trans_fat: 'Trans Fat (g)',
    dietary_fiber: 'Dietary Fiber (g)',
    total_sugars: 'Total Sugars (g)',
    sodium: 'Sodium (mg)',
    vitamin_c: 'Vitamin C (mg)',
    vitamin_a: 'Vitamin A (μg)',
    calcium: 'Calcium (mg)',
    iron: 'Iron (mg)',
    potassium: 'Potassium (mg)',
    serving_size: 'Serving Size',
    servings_per_container: 'Servings Per Container'
  };

  // Load nutrition template based on category
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const apiUrl = `/api/labels/nutrition-templates?category=${category}`;
        console.log('🧪 Loading nutrition template from:', apiUrl);
        const response = await fetch(apiUrl);
        console.log('🧪 Nutrition template response status:', response.status);
        if (response.ok) {
          const templateResponse = await response.json();
          console.log('🧪 Nutrition template data:', templateResponse);
          if (templateResponse.success) {
            setTemplate(templateResponse.data);
            console.log('✅ Template loaded successfully:', templateResponse.data);
          }
        }
      } catch (error) {
        console.error('❌ Failed to load nutrition template:', error);
        console.log('🔄 Using fallback template for category:', category);
        // Fallback template for fruits
        const fallbackTemplate = {
          category: category,
          required_fields: ['energy_kcal', 'protein', 'carbohydrates', 'total_fat', 'dietary_fiber'],
          optional_fields: ['vitamin_c', 'potassium', 'calcium', 'iron']
        };
        setTemplate(fallbackTemplate);
        console.log('✅ Fallback template set:', fallbackTemplate);
      }
    };

    if (category) {
      loadTemplate();
    }
  }, [category]);

  // Enhanced auto-fill using server-side OpenFoodFacts proxy to bypass CSP
  const searchNutritionData = async () => {
    setIsSearching(true);
    try {
      // Clean product name for better search results
      const cleanQuery = productName.replace(/organic\s*/i, '').trim();
      console.log('🔍 Searching OpenFoodFacts via server proxy for:', cleanQuery);
      
      // Use our server-side proxy to bypass CSP restrictions
      const response = await fetch(`/api/nutrition/search?q=${encodeURIComponent(cleanQuery)}&country=India`);
      
      console.log('📡 Nutrition search response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('🥗 OpenFoodFacts proxy response:', result);
        
        if (result.status === 'success' && result.product && result.product.nutrition) {
          const nutrition = result.product.nutrition;
          
          // Map the nutrition data to our form format
          const mappedData = {
            serving_size: result.product.serving_size || '100g',
            servings_per_container: 1,
            energy_kcal: Math.round(nutrition.energy_kcal || 0),
            protein: Math.round((nutrition.protein || 0) * 10) / 10,
            carbohydrates: Math.round((nutrition.carbohydrates || 0) * 10) / 10,
            total_fat: Math.round((nutrition.total_fat || 0) * 10) / 10,
            saturated_fat: Math.round((nutrition.saturated_fat || 0) * 10) / 10,
            trans_fat: Math.round((nutrition.trans_fat || 0) * 10) / 10,
            dietary_fiber: Math.round((nutrition.dietary_fiber || 0) * 10) / 10,
            total_sugars: Math.round((nutrition.total_sugars || 0) * 10) / 10,
            sodium: Math.round(nutrition.sodium || 0),
            vitamin_c: Math.round(nutrition.vitamin_c || 0),
            calcium: Math.round(nutrition.calcium || 0),
            iron: Math.round((nutrition.iron || 0) * 10) / 10,
            potassium: Math.round(nutrition.potassium || 0)
          };
          
          setNutritionData(mappedData);
          toast.success(`Auto-filled nutrition data for "${result.product.name}" from ${result.source} database`, {
            duration: 3000,
            icon: '🥗'
          });
          console.log('✅ Auto-fill successful from:', result.source);
        } else if (result.status === 'not_found') {
          console.log('❌ No nutrition data found for:', cleanQuery);
          toast.error(`No nutrition data found for "${cleanQuery}". ${result.suggestion || 'Try manual entry.'}`, {
            duration: 4000
          });
        } else {
          throw new Error(result.message || 'Unknown error from nutrition API');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Auto-fill error:', error);
      toast.error(`Failed to fetch nutrition data: ${error.message}`, {
        duration: 4000
      });
    } finally {
      setIsSearching(false);
    }
  };



  const handleInputChange = (field: keyof NutritionData, value: string | number) => {
    setNutritionData(prev => ({
      ...prev,
      [field]: field === 'serving_size' ? value : parseFloat(value as string) || 0
    }));
  };

  const handleSave = () => {
    if (template) {
      // Validate required fields
      const missingFields = template.required_fields.filter(field => 
        !nutritionData[field as keyof NutritionData] && nutritionData[field as keyof NutritionData] !== 0
      );
      
      if (missingFields.length > 0) {
        alert(`Please fill in required fields: ${missingFields.join(', ')}`);
        return;
      }
    }
    
    onNutritionData(nutritionData as NutritionData);
    onClose();
  };

  const handleSkip = () => {
    onNutritionData(null);
    onClose();
  };

  if (!template) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-center">Loading nutrition template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add Nutrition Facts</h2>
              <p className="text-sm text-gray-600">Product: {productName} | Category: {category}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={searchNutritionData}
                disabled={isSearching}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <GlobeAltIcon className="h-4 w-4" />
                <span>{isSearching ? 'Searching OpenFoodFacts...' : 'Auto-Fill from Database'}</span>
              </button>
              <button
                onClick={() => {
                  // Reset form to empty state for manual entry
                  setNutritionData({
                    serving_size: '100g',
                    servings_per_container: 1
                  });
                  toast.info('Form cleared for manual entry');
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                <DocumentTextIcon className="h-4 w-4" />
                <span>Manual Entry</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>



        <div className="p-6">
          {/* Serving Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Serving Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serving Size
                </label>
                <input
                  type="text"
                  value={nutritionData.serving_size || ''}
                  onChange={(e) => handleInputChange('serving_size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 100g, 1 cup, 1 piece"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servings Per Container
                </label>
                <input
                  type="number"
                  value={nutritionData.servings_per_container || ''}
                  onChange={(e) => handleInputChange('servings_per_container', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Required Fields */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <BeakerIcon className="h-5 w-5 mr-2" />
              Required Nutrition Information (per 100g)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {template.required_fields.map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {fieldLabels[field as keyof typeof fieldLabels]} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={nutritionData[field as keyof NutritionData] || ''}
                    onChange={(e) => handleInputChange(field as keyof NutritionData, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Optional Fields */}
          {template.optional_fields && template.optional_fields.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Additional Nutrition Information (Optional)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {template.optional_fields.map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {fieldLabels[field as keyof typeof fieldLabels]}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={nutritionData[field as keyof NutritionData] || ''}
                      onChange={(e) => handleInputChange(field as keyof NutritionData, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FSSAI Compliance Note */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>FSSAI Compliance:</strong> This form follows Indian Food Safety and Standards Authority guidelines. 
              Energy values are displayed per 100g as required by Indian regulations.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Skip Nutrition Facts
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Nutrition Facts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionFactsForm;