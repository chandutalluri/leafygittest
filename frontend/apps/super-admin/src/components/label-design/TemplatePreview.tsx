import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  EyeIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  CogIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { useTemplateRefresh } from '../../hooks/useTemplateRefresh';

interface LabelTemplate {
  id: string | number;
  name: string;
  description?: string;
  template_data?: {
    paperSize?: string;
    orientation?: 'portrait' | 'landscape';
    labelWidth?: number;
    labelHeight?: number;
    horizontalCount?: number;
    verticalCount?: number;
    elements?: any[];
  };
  // Legacy fields for backward compatibility
  paper_size?: string;
  label_width?: number;
  label_height?: number;
  horizontal_count?: number;
  vertical_count?: number;
  margin_top?: number;
  margin_left?: number;
  horizontal_gap?: number;
  vertical_gap?: number;
  orientation?: 'portrait' | 'landscape';
  elements?: any[];
  created_at?: string;
  updated_at?: string;
}

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

interface TemplatePreviewProps {
  onTemplateLoad?: (template: LabelTemplate) => void;
  needsRefresh?: boolean;
  onRefreshComplete?: () => void;
}

export default function TemplatePreview({
  onTemplateLoad,
  needsRefresh = false,
  onRefreshComplete,
}: TemplatePreviewProps = {}) {
  // Use the template refresh hook for real-time updates
  const {
    templates: hookTemplates,
    refresh: refreshTemplates,
    templateCount,
  } = useTemplateRefresh();

  const [selectedTemplate, setSelectedTemplate] = useState<LabelTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'single' | 'sheet'>('single');
  const [refreshKey, setRefreshKey] = useState(0);
  const [templateType, setTemplateType] = useState<'custom' | 'media'>('custom');
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<LabelTemplate | null>(null);

  // Fetch media types on mount
  useEffect(() => {
    fetchMediaTypes();
  }, []);

  // Set initial template when templates change
  useEffect(() => {
    if (hookTemplates && hookTemplates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(hookTemplates[0]);
    }
  }, [hookTemplates, selectedTemplate]);

  // Handle needsRefresh prop
  useEffect(() => {
    if (needsRefresh) {
      console.log('🔄 Template saved - force refreshing template list');
      refreshTemplates();
      if (onRefreshComplete) {
        setTimeout(onRefreshComplete, 100);
      }
    }
  }, [needsRefresh, refreshTemplates, onRefreshComplete]);

  const fetchMediaTypes = async () => {
    try {
      const response = await fetch('/api/labels/media-types');
      if (response.ok) {
        const data = await response.json();
        // Check if data.data exists and is an array
        if (data.success && data.data && Array.isArray(data.data)) {
          const formattedMediaTypes = data.data.map((media: any) => ({
            id: media.id,
            name: media.name || media.avery_code,
            code: media.avery_code || media.code,
            dimensions: {
              pageWidth: parseFloat(media.paper_width || media.dimensions?.pageWidth || 210),
              pageHeight: parseFloat(media.paper_height || media.dimensions?.pageHeight || 297),
              labelWidth: parseFloat(
                media.label_width_mm || media.label_width || media.dimensions?.labelWidth || 63.5
              ),
              labelHeight: parseFloat(
                media.label_height_mm || media.label_height || media.dimensions?.labelHeight || 38.1
              ),
              columns: parseInt(
                media.horizontal_count || media.columns || media.dimensions?.columns || 3
              ),
              rows: parseInt(media.vertical_count || media.rows || media.dimensions?.rows || 7),
              marginTop: parseFloat(media.margin_top || media.dimensions?.marginTop || 0),
              marginLeft: parseFloat(media.margin_left || media.dimensions?.marginLeft || 0),
              spacingX: parseFloat(
                media.horizontal_gap || media.spacing_x || media.dimensions?.spacingX || 0
              ),
              spacingY: parseFloat(
                media.vertical_gap || media.spacing_y || media.dimensions?.spacingY || 0
              ),
            },
            orientation: media.orientation || 'portrait',
            description: media.description,
            manufacturer: media.manufacturer || 'Avery',
            isActive: media.is_active !== false,
          }));
          setMediaTypes(formattedMediaTypes);
        } else {
          console.error('Invalid response format from media types API:', data);
          setMediaTypes([]);
        }
      } else {
        console.error('Failed to fetch media types:', response.status);
        setMediaTypes([]);
      }
    } catch (error) {
      console.error('Error fetching media types:', error);
      toast.error('Failed to load media templates');
      setMediaTypes([]);
    }
  };

  const handleManualRefresh = () => {
    console.log('Manual refresh triggered');
    setRefreshKey(prev => prev + 1);
    if (templateType === 'custom') {
      refreshTemplates();
    } else {
      fetchMediaTypes();
    }
    toast.success('Templates refreshed');
  };

  const loadTemplateIntoDesigner = (template: LabelTemplate) => {
    if (onTemplateLoad) {
      console.log('🎨 Loading template into Professional Label Designer:', template.name);

      // Extract template data and elements for loading into canvas
      const templateData = getTemplateData(template);
      const templateWithElements = {
        ...template,
        template_data: templateData,
        elements: templateData.elements || [],
      };

      onTemplateLoad(templateWithElements);
      toast.success(
        `Template "${template.name}" loaded into designer with ${templateData.elements.length} elements!`
      );
    } else {
      toast.error('Template loading not available - designer not connected');
    }
  };

  const loadMediaTemplateIntoDesigner = (media: MediaType) => {
    if (onTemplateLoad) {
      console.log('🎨 Loading media template into Professional Label Designer:', media.name);

      // Convert media template to label template format
      const templateFromMedia: LabelTemplate = {
        id: `media-${media.id}`,
        name: media.name,
        description:
          media.description ||
          `${media.code} - ${media.dimensions.columns}×${media.dimensions.rows} labels`,
        paper_size: media.orientation === 'portrait' ? 'A4' : 'A4-landscape',
        label_width: media.dimensions.labelWidth,
        label_height: media.dimensions.labelHeight,
        horizontal_count: media.dimensions.columns,
        vertical_count: media.dimensions.rows,
        margin_top: media.dimensions.marginTop,
        margin_left: media.dimensions.marginLeft,
        horizontal_gap: media.dimensions.spacingX,
        vertical_gap: media.dimensions.spacingY,
        orientation: media.orientation,
        elements: [],
        template_data: {
          paperSize: media.orientation === 'portrait' ? 'A4' : 'A4-landscape',
          orientation: media.orientation,
          labelWidth: media.dimensions.labelWidth,
          labelHeight: media.dimensions.labelHeight,
          horizontalCount: media.dimensions.columns,
          verticalCount: media.dimensions.rows,
          elements: [],
        },
      };

      onTemplateLoad(templateFromMedia);
      toast.success(`Media template "${media.name}" loaded into designer!`);
    } else {
      toast.error('Template loading not available - designer not connected');
    }
  };

  const handleEditTemplate = async (template: LabelTemplate) => {
    // First load template into designer, then show edit modal
    loadTemplateIntoDesigner(template);
    toast(`Template "${template.name}" loaded for editing`);
  };

  const handleDeleteTemplate = async (template: LabelTemplate) => {
    if (
      !confirm(
        `Are you sure you want to delete template "${template.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/labels/custom-templates/${template.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(`Template "${template.name}" deleted successfully`);
        // Refresh templates list using the hook
        refreshTemplates();
        // Clear selection if deleted template was selected
        if (selectedTemplate?.id === template.id) {
          setSelectedTemplate(null);
        }
      } else {
        toast.error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Error deleting template');
    }
  };

  const handleCreateNewTemplate = () => {
    toast('Switch to Professional Designer to create a new template');
  };

  const getTemplateData = (template: LabelTemplate) => {
    // Extract data from either template_data JSON or legacy fields
    const data = template.template_data || {};
    return {
      labelWidth: data.labelWidth || template.label_width || 80,
      labelHeight: data.labelHeight || template.label_height || 40,
      horizontalCount: data.horizontalCount || template.horizontal_count || 1,
      verticalCount: data.verticalCount || template.vertical_count || 1,
      paperSize: data.paperSize || template.paper_size || 'A4',
      orientation: data.orientation || template.orientation || 'portrait',
      elements: data.elements || template.elements || [],
    };
  };

  const renderLabelPreview = (template: LabelTemplate) => {
    const templateData = getTemplateData(template);
    const scale = 2; // mm to px
    const width = templateData.labelWidth * scale;
    const height = templateData.labelHeight * scale;

    return (
      <div
        className="bg-white border-2 border-gray-300 rounded-lg shadow-lg"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-2">Template: {template.name}</div>
          <div className="text-sm font-medium">Label Preview</div>
          <div className="text-xs text-gray-400 mt-2">
            {templateData.labelWidth} × {templateData.labelHeight} mm
          </div>
          {templateData.elements.length > 0 && (
            <div className="text-xs text-emerald-600 mt-1">
              {templateData.elements.length} elements
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSheetPreview = (template: LabelTemplate) => {
    const scale = 1; // Smaller scale for sheet view
    const labelWidth = (template.label_width || 100) * scale;
    const labelHeight = (template.label_height || 50) * scale;
    const marginTop = (template.margin_top || 10) * scale;
    const marginLeft = (template.margin_left || 10) * scale;
    const hGap = (template.horizontal_gap || 3) * scale;
    const vGap = (template.vertical_gap || 3) * scale;

    const labels = [];
    for (let row = 0; row < (template.vertical_count || 1); row++) {
      for (let col = 0; col < (template.horizontal_count || 1); col++) {
        const left = marginLeft + col * (labelWidth + hGap);
        const top = marginTop + row * (labelHeight + vGap);

        labels.push(
          <div
            key={`${row}-${col}`}
            className="absolute bg-white border border-gray-400"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${labelWidth}px`,
              height: `${labelHeight}px`,
            }}
          >
            <div className="text-xs text-gray-400 p-1">
              {row + 1}-{col + 1}
            </div>
          </div>
        );
      }
    }

    const sheetWidth = template.paper_size === 'A4' ? 210 : 216; // A4 or Letter
    const sheetHeight = template.paper_size === 'A4' ? 297 : 279;

    return (
      <div
        className="relative bg-gray-50 border-2 border-gray-400 shadow-xl"
        style={{
          width: `${sheetWidth * scale}px`,
          height: `${sheetHeight * scale}px`,
        }}
      >
        {labels}
      </div>
    );
  };

  const renderMediaPreview = (media: MediaType) => {
    const scale = Math.min(400 / media.dimensions.pageWidth, 550 / media.dimensions.pageHeight);

    const labels = [];
    for (let row = 0; row < media.dimensions.rows; row++) {
      for (let col = 0; col < media.dimensions.columns; col++) {
        const x =
          media.dimensions.marginLeft +
          col * (media.dimensions.labelWidth + media.dimensions.spacingX);
        const y =
          media.dimensions.marginTop +
          row * (media.dimensions.labelHeight + media.dimensions.spacingY);
        labels.push({ x, y, row, col });
      }
    }

    return (
      <div className="flex flex-col items-center">
        <div
          className="relative bg-white shadow-xl"
          style={{
            width: media.dimensions.pageWidth * scale,
            height: media.dimensions.pageHeight * scale,
            border: '2px solid #e5e7eb',
          }}
        >
          {/* Margin guides */}
          <div
            className="absolute border-l-2 border-t-2 border-dashed border-red-300"
            style={{
              left: 0,
              top: 0,
              width: media.dimensions.marginLeft * scale,
              height: media.dimensions.marginTop * scale,
            }}
          />

          {/* Labels */}
          {labels.map((label, idx) => (
            <div
              key={idx}
              className="absolute bg-blue-50 border border-blue-300 flex items-center justify-center text-xs font-medium text-blue-600"
              style={{
                left: label.x * scale,
                top: label.y * scale,
                width: media.dimensions.labelWidth * scale,
                height: media.dimensions.labelHeight * scale,
              }}
            >
              {label.row + 1},{label.col + 1}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600 space-y-1">
          <div>
            Page: {media.dimensions.pageWidth} × {media.dimensions.pageHeight}mm
          </div>
          <div>
            Labels: {media.dimensions.columns} × {media.dimensions.rows} ={' '}
            {media.dimensions.columns * media.dimensions.rows} labels
          </div>
          <div>
            Label size: {media.dimensions.labelWidth} × {media.dimensions.labelHeight}mm
          </div>
          <div>
            Margins: {media.dimensions.marginTop}mm top, {media.dimensions.marginLeft}mm left
          </div>
          <div>
            Spacing: {media.dimensions.spacingX}mm horizontal, {media.dimensions.spacingY}mm
            vertical
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Template List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {templateType === 'custom'
                ? `Custom Templates (${hookTemplates.length})`
                : `Media Templates (${mediaTypes.length})`}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleManualRefresh}
                className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
              >
                <ArrowPathIcon className="w-4 h-4" />
              </button>
              {templateType === 'custom' && (
                <button
                  onClick={handleCreateNewTemplate}
                  className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Template
                </button>
              )}
            </div>
          </div>

          {/* Template Type Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTemplateType('custom')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                templateType === 'custom'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Custom Templates
            </button>
            <button
              onClick={() => setTemplateType('media')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                templateType === 'media'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Media Templates
            </button>
          </div>

          <div className="space-y-2">
            {templateType === 'custom' ? (
              hookTemplates.length === 0 ? (
                <p className="text-gray-500 text-sm">No custom templates available</p>
              ) : (
                hookTemplates.map(template => {
                  const templateData = getTemplateData(template);
                  return (
                    <div
                      key={template.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div onClick={() => setSelectedTemplate(template)} className="cursor-pointer">
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">
                          {templateData.paperSize} - {templateData.horizontalCount}×
                          {templateData.verticalCount} labels
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {templateData.labelWidth}×{templateData.labelHeight}mm per label
                        </div>
                        {templateData.elements.length > 0 && (
                          <div className="text-xs text-emerald-600 mt-1">
                            {templateData.elements.length} design elements
                          </div>
                        )}
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          loadTemplateIntoDesigner(template);
                        }}
                        className="mt-2 w-full px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700"
                      >
                        Load Template
                      </button>
                    </div>
                  );
                })
              )
            ) : mediaTypes.length === 0 ? (
              <p className="text-gray-500 text-sm">No media templates available</p>
            ) : (
              mediaTypes.map(media => (
                <div
                  key={media.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedMedia?.id === media.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div onClick={() => setSelectedMedia(media)} className="cursor-pointer">
                    <div className="font-medium">{media.name}</div>
                    <div className="text-sm text-gray-500">
                      {media.code} - {media.dimensions.columns}×{media.dimensions.rows} labels
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {media.dimensions.labelWidth}×{media.dimensions.labelHeight}mm per label
                    </div>
                    <div className="text-xs text-gray-400">
                      {media.dimensions.pageWidth}×{media.dimensions.pageHeight}mm{' '}
                      {media.orientation}
                    </div>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      loadMediaTemplateIntoDesigner(media);
                    }}
                    className="mt-2 w-full px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  >
                    Use This Format
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-2">
        {selectedTemplate ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">
                {templateType === 'custom' ? 'Template Preview' : 'Media Format Preview'}
              </h3>
              <div className="flex gap-2">
                {templateType === 'custom' && (
                  <>
                    <button
                      onClick={() => setPreviewMode(previewMode === 'single' ? 'sheet' : 'single')}
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {previewMode === 'single' ? (
                        <>
                          <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                          View Sheet
                        </>
                      ) : (
                        <>
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View Single
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => loadTemplateIntoDesigner(selectedTemplate)}
                      className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                      Load Template
                    </button>
                    <button
                      onClick={() => handleEditTemplate(selectedTemplate)}
                      className="flex items-center px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      <CogIcon className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(selectedTemplate)}
                      className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </>
                )}
                {templateType === 'media' && selectedMedia && (
                  <button
                    onClick={() => loadMediaTemplateIntoDesigner(selectedMedia)}
                    className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                    Use This Format
                  </button>
                )}
                <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Test Print
                </button>
              </div>
            </div>

            {/* Template/Media Details */}
            {templateType === 'custom' && selectedTemplate ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Template Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Paper Size:</span> {selectedTemplate.paper_size}
                  </div>
                  <div>
                    <span className="text-gray-500">Orientation:</span>{' '}
                    {selectedTemplate.orientation}
                  </div>
                  <div>
                    <span className="text-gray-500">Labels per Sheet:</span>{' '}
                    {(selectedTemplate.horizontal_count || 1) * (selectedTemplate.vertical_count || 1)}
                  </div>
                  <div>
                    <span className="text-gray-500">Label Size:</span>{' '}
                    {selectedTemplate.label_width}×{selectedTemplate.label_height}mm
                  </div>
                </div>
              </div>
            ) : templateType === 'media' && selectedMedia ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Media Format Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Format Code:</span> {selectedMedia.code}
                  </div>
                  <div>
                    <span className="text-gray-500">Manufacturer:</span>{' '}
                    {selectedMedia.manufacturer || 'Standard'}
                  </div>
                  <div>
                    <span className="text-gray-500">Page Size:</span>{' '}
                    {selectedMedia.dimensions.pageWidth}×{selectedMedia.dimensions.pageHeight}mm
                  </div>
                  <div>
                    <span className="text-gray-500">Label Size:</span>{' '}
                    {selectedMedia.dimensions.labelWidth}×{selectedMedia.dimensions.labelHeight}mm
                  </div>
                  <div>
                    <span className="text-gray-500">Labels per Sheet:</span>{' '}
                    {selectedMedia.dimensions.columns * selectedMedia.dimensions.rows}
                  </div>
                  <div>
                    <span className="text-gray-500">Layout:</span>{' '}
                    {selectedMedia.dimensions.columns}×{selectedMedia.dimensions.rows}{' '}
                    {selectedMedia.orientation}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Preview */}
            <div className="flex justify-center items-center p-8 bg-gray-100 rounded-lg overflow-auto">
              {templateType === 'custom' && selectedTemplate
                ? previewMode === 'single'
                  ? renderLabelPreview(selectedTemplate)
                  : renderSheetPreview(selectedTemplate)
                : templateType === 'media' && selectedMedia
                  ? renderMediaPreview(selectedMedia)
                  : null}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center text-gray-500">
              Select a {templateType === 'custom' ? 'template' : 'media format'} to preview
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
