import React, { useState } from 'react';
import { MediaTemplateSelector } from './MediaTemplateSelector';
import { LabelDesigner } from './LabelDesigner';
import { TemplateLibrary } from './TemplateLibrary';
import { PrintManager } from './PrintManager';
import { toast } from 'react-hot-toast';

interface MediaTemplate {
  id: number;
  name: string;
  dimensions: {
    labelWidth: number;
    labelHeight: number;
  };
}

interface DesignTemplate {
  id: number;
  name: string;
  description?: string;
  templateJson: {
    elements: any[];
    labelSettings: any;
  };
}

export function LabelDesignWorkflow() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedMedia, setSelectedMedia] = useState<MediaTemplate | null>(null);
  const [selectedDesignTemplate, setSelectedDesignTemplate] = useState<DesignTemplate | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [currentDesign, setCurrentDesign] = useState<any[]>([]);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);

  const handleMediaSelect = (template: MediaTemplate) => {
    setSelectedMedia(template);
    setCurrentStep(2);
  };

  const handleDesignTemplateSelect = (template: DesignTemplate) => {
    setSelectedDesignTemplate(template);
    setCurrentStep(3);
  };

  const handleProductsSelect = (products: any[]) => {
    setSelectedProducts(products);
    setCurrentStep(4);
  };

  const handleDesignSave = async (elements: any[]) => {
    setCurrentDesign(elements);
    
    // Show save template modal
    const templateName = prompt('Enter template name:');
    if (!templateName) return;
    
    const templateDescription = prompt('Enter template description (optional):');
    
    try {
      const response = await fetch('/api/labels/custom-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          description: templateDescription,
          type: 'custom',
          mediaId: selectedMedia!.id,
          templateJson: {
            elements,
            labelSettings: {
              backgroundColor: '#ffffff',
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: '#000000'
            }
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Template saved successfully');
        setCurrentStep(3);
      } else {
        toast.error('Failed to save template');
      }
    } catch (error) {
      toast.error('Error saving template');
    }
  };

  const handleTemplateSelect = (template: DesignTemplate) => {
    setSelectedDesignTemplate(template);
    setCurrentDesign(template.templateJson.elements);
    setShowTemplateLibrary(false);
    setCurrentStep(3);
  };

  const steps = [
    { id: 1, name: 'Media Template', completed: !!selectedMedia },
    { id: 2, name: 'Label Design Template', completed: !!selectedDesignTemplate || currentDesign.length > 0 },
    { id: 3, name: 'Product Selection', completed: selectedProducts.length > 0 },
    { id: 4, name: 'Print Job', completed: false }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Step Indicator */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : currentStep === step.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {step.completed ? '✓' : index + 1}
              </div>
              <span
                className={`ml-3 font-medium ${
                  currentStep === step.id ? 'text-emerald-600' : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className="w-24 h-0.5 bg-gray-300 mx-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Step 1: Media Template Selection */}
        {currentStep === 1 && (
          <div className="h-full">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Step 1: Select Media Template</h2>
              <p className="text-gray-600 mt-1">Choose the physical media type for your labels (A4, roll, etc.)</p>
            </div>
            <MediaTemplateSelector onSelect={handleMediaSelect} />
          </div>
        )}
        
        {/* Step 2: Label Design Template */}
        {currentStep === 2 && selectedMedia && (
          <div className="h-full">
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Step 2: Create Label Design Template</h2>
                  <p className="text-gray-600 mt-1">
                    Design your label template for media: {selectedMedia.name} ({selectedMedia.dimensions.labelWidth} × {selectedMedia.dimensions.labelHeight}mm)
                  </p>
                </div>
                <button
                  onClick={() => setShowTemplateLibrary(true)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  Load Existing Template
                </button>
              </div>
            </div>
            
            <div className="h-full">
              <LabelDesigner
                mediaTemplate={selectedMedia}
                onSave={handleDesignSave}
              />
            </div>
          </div>
        )}
        
        {/* Step 3: Product Selection */}
        {currentStep === 3 && selectedMedia && (
          <div className="h-full">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Step 3: Select Products</h2>
              <p className="text-gray-600 mt-1">Choose which products will use this label design</p>
            </div>
            
            <div className="p-6">
              <div className="bg-white border rounded-lg p-8">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Product Selection</h3>
                  <p className="text-gray-600 mb-4">Select products that will use this label design</p>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Selected Products: {selectedProducts.length}</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px]">
                      <p className="text-gray-500">Product selection interface will be implemented here</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 justify-center">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Back to Design
                    </button>
                    <button
                      onClick={() => {
                        // Mock product selection for now
                        setSelectedProducts([{ id: 1, name: 'Sample Product' }]);
                        setCurrentStep(4);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                    >
                      Continue to Print Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Print Job */}
        {currentStep === 4 && selectedMedia && (
          <div className="h-full">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Step 4: Create Print Job</h2>
              <p className="text-gray-600 mt-1">Configure and execute the print job for your labels</p>
            </div>
            
            <PrintManager
              mediaTemplate={selectedMedia}
              designTemplate={selectedDesignTemplate || {
                id: 0,
                name: 'Current Design',
                templateJson: {
                  elements: currentDesign,
                  labelSettings: {}
                }
              }}
              selectedProducts={selectedProducts}
            />
          </div>
        )}
      </div>

      {/* Template Library Modal */}
      {showTemplateLibrary && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-4/5 max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Template Library</h3>
              <button
                onClick={() => setShowTemplateLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(80vh-120px)]">
              <TemplateLibrary
                mediaId={selectedMedia.id}
                onSelect={handleTemplateSelect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}