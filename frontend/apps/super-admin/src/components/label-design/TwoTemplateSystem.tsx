import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ArrowRightIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import MediaTemplateManager from './MediaTemplateManager';
import LabelTemplateManager from './LabelTemplateManager';

interface MediaType {
  id: number;
  name: string;
  code: string;
  dimensions: {
    pageWidth: number;
    pageHeight: number;
    labelWidth: number;
    labelHeight: number;
    columns: number;
    rows: number;
    marginTop: number;
    marginLeft: number;
    spacingX: number;
    spacingY: number;
  };
  orientation: 'portrait' | 'landscape';
  description?: string;
  manufacturer?: string;
  isActive: boolean;
}

interface LabelTemplate {
  id: number;
  name: string;
  description?: string;
  type: string;
  mediaId: number;
  templateJson: {
    elements: any[];
    labelSettings: any;
  };
  createdAt: string;
  isActive: boolean;
}

interface TwoTemplateSystemProps {
  onTemplateReady?: (media: MediaType, template: LabelTemplate) => void;
  onDesignStart?: (media: MediaType) => void;
}

export default function TwoTemplateSystem({ onTemplateReady, onDesignStart }: TwoTemplateSystemProps) {
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const [currentStep, setCurrentStep] = useState<'media' | 'template' | 'design'>('media');
  const [showLabelTemplates, setShowLabelTemplates] = useState(false);

  useEffect(() => {
    fetchMediaTypes();
  }, []);

  const fetchMediaTypes = async () => {
    try {
      const response = await fetch('/api/labels/media-types');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Map backend response to frontend interface - same mapping as MediaTemplateManager
          const mappedMediaTypes = data.data.map((media: any) => ({
            id: media.id,
            name: media.name,
            code: media.productCode, // Map productCode to code
            dimensions: {
              pageWidth: media.physicalProperties.pageWidth,
              pageHeight: media.physicalProperties.pageHeight,
              labelWidth: media.physicalProperties.labelWidth,
              labelHeight: media.physicalProperties.labelHeight,
              columns: media.physicalProperties.labelsPerRow, // Map labelsPerRow to columns
              rows: media.physicalProperties.labelsPerColumn, // Map labelsPerColumn to rows
              marginTop: media.physicalProperties.marginTop,
              marginLeft: media.physicalProperties.marginLeft,
              spacingX: media.physicalProperties.horizontalSpacing, // Map horizontalSpacing to spacingX
              spacingY: media.physicalProperties.verticalSpacing // Map verticalSpacing to spacingY
            },
            orientation: media.orientation,
            description: media.description,
            manufacturer: media.manufacturer,
            isActive: media.isActive
          }));
          setMediaTypes(mappedMediaTypes);
          console.log('🏷️ TwoTemplateSystem media types loaded:', mappedMediaTypes.length);
        }
      }
    } catch (error) {
      console.error('Error fetching media types:', error);
    }
  };

  const handleMediaSelect = (media: MediaType) => {
    console.log('🎯 Media selection triggered for:', media.name);
    console.log('📐 Media dimensions structure:', media.dimensions);
    setSelectedMedia(media);
    setCurrentStep('template');
    setShowLabelTemplates(true);
    console.log(`📄 Media selected: ${media.name} (${media.dimensions.labelWidth}×${media.dimensions.labelHeight}mm)`);
  };

  const handleTemplateLoad = (template: LabelTemplate) => {
    if (selectedMedia) {
      // Handle both template_data and templateJson formats
      const templateData = template.templateJson || (template as any).template_data;
      const elementsCount = templateData?.elements?.length || 0;
      
      console.log(`🎨 Template selected: ${template.name} with ${elementsCount} elements`);
      console.log('🔍 Passing selectedMedia to onTemplateReady:', selectedMedia);
      
      // Ensure template has the correct structure
      const normalizedTemplate = {
        ...template,
        templateJson: templateData || { elements: [], labelSettings: {} }
      };
      
      setCurrentStep('design');
      onTemplateReady?.(selectedMedia, normalizedTemplate);
      toast.success(`Ready to design: ${template.name} on ${selectedMedia.name}`);
    }
  };

  const handleStartFromScratch = () => {
    if (selectedMedia) {
      console.log(`🆕 Starting blank design on ${selectedMedia.name}`);
      console.log('🔍 Passing selectedMedia to onDesignStart:', selectedMedia);
      setCurrentStep('design');
      onDesignStart?.(selectedMedia);
      toast.success(`Starting blank design on ${selectedMedia.name}`);
    }
  };

  const getStepStatus = (step: 'media' | 'template' | 'design') => {
    if (currentStep === step) return 'current';
    if (step === 'media') return 'completed';
    if (step === 'template' && selectedMedia) return currentStep === 'design' ? 'completed' : 'current';
    if (step === 'design' && currentStep === 'design') return 'current';
    return 'pending';
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 text-white border-emerald-500';
      case 'current':
        return 'bg-blue-500 text-white border-blue-500';
      default:
        return 'bg-gray-200 text-gray-500 border-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {/* Step 1: Media Selection */}
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold ${getStepClasses(getStepStatus('media'))}`}>
              1
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Select Media Type</div>
              <div className="text-xs text-gray-500">Choose paper format & layout</div>
            </div>
          </div>

          <ArrowRightIcon className="w-5 h-5 text-gray-400" />

          {/* Step 2: Template Selection */}
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold ${getStepClasses(getStepStatus('template'))}`}>
              2
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Select/Create Template</div>
              <div className="text-xs text-gray-500">Choose design or start blank</div>
            </div>
          </div>

          <ArrowRightIcon className="w-5 h-5 text-gray-400" />

          {/* Step 3: Design */}
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold ${getStepClasses(getStepStatus('design'))}`}>
              3
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Design Label</div>
              <div className="text-xs text-gray-500">Create your label content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Selection Summary */}
      {selectedMedia && (
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Selected Media: {selectedMedia.name}</h3>
              <div className="text-sm text-gray-600 flex items-center space-x-4">
                <span>Label: {selectedMedia.dimensions.labelWidth} × {selectedMedia.dimensions.labelHeight}mm</span>
                <span>Sheet: {selectedMedia.dimensions.columns} × {selectedMedia.dimensions.rows} layout</span>
                <span>{selectedMedia.dimensions.columns * selectedMedia.dimensions.rows} labels per sheet</span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedMedia(null);
                setCurrentStep('media');
                setShowLabelTemplates(false);
              }}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              Change Media
            </button>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="space-y-6">
        {/* Step 1: Media Template Manager */}
        {currentStep === 'media' && (
          <MediaTemplateManager
            onMediaSelect={handleMediaSelect}
            selectedMediaId={selectedMedia?.id}
          />
        )}

        {/* Step 2: Label Template Manager */}
        {showLabelTemplates && selectedMedia && (
          <div className="space-y-6">
            <LabelTemplateManager
              onTemplateLoad={handleTemplateLoad}
              selectedMediaId={selectedMedia.id}
              mediaTypes={mediaTypes}
            />
            
            {/* Quick Start Options */}
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Cog6ToothIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Or Start from Scratch</h3>
                <p className="text-gray-600 mb-4">
                  Create a completely new label design on {selectedMedia.name}
                </p>
                <button
                  onClick={handleStartFromScratch}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-2" />
                  Start Blank Design
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Design Ready */}
        {currentStep === 'design' && (
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-8 text-center border-2 border-emerald-200">
            <div className="text-emerald-600 text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Design!</h3>
            <p className="text-gray-600 mb-4">
              Your design workspace is being prepared with the selected media format.
            </p>
            <div className="text-sm text-gray-500">
              The Professional Label Designer will show a single label canvas sized for your chosen format.
            </div>
          </div>
        )}
      </div>

      {/* System Architecture Note */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Two-Template System Architecture</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <div><strong>Media Templates:</strong> Define paper dimensions, label layout, and Avery format specifications</div>
          <div><strong>Label Templates:</strong> Contain the actual design elements (text, images, QR codes) for single labels</div>
          <div><strong>Designer Canvas:</strong> Shows only the single label dimensions for precise design work</div>
          <div><strong>Print Preview:</strong> Will show how the single design replicates across the full sheet layout</div>
        </div>
      </div>
    </div>
  );
}