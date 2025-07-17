import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, TrashIcon, PencilIcon, RectangleStackIcon } from '@heroicons/react/24/outline';

// Live Preview Component
interface LiveLabelPreviewProps {
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
}

const LiveLabelPreview: React.FC<LiveLabelPreviewProps> = ({
  pageWidth,
  pageHeight,
  labelWidth,
  labelHeight,
  columns,
  rows,
  marginTop,
  marginLeft,
  spacingX,
  spacingY
}) => {
  // Scale factor to fit the preview in the available space
  const scale = Math.min(400 / pageWidth, 550 / pageHeight);
  
  const renderLabels = () => {
    const labels = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = marginLeft + col * (labelWidth + spacingX);
        const y = marginTop + row * (labelHeight + spacingY);
        
        // Check if label fits within page bounds
        if (x + labelWidth <= pageWidth && y + labelHeight <= pageHeight) {
          labels.push(
            <rect
              key={`${row}-${col}`}
              x={x * scale}
              y={y * scale}
              width={labelWidth * scale}
              height={labelHeight * scale}
              fill="white"
              stroke="#e5e7eb"
              strokeWidth="1"
              rx="2"
            />
          );
        }
      }
    }
    return labels;
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width={pageWidth * scale}
        height={pageHeight * scale}
        className="border-2 border-gray-300 bg-white shadow-md"
        style={{ maxWidth: '100%', maxHeight: '550px' }}
      >
        {/* Page background */}
        <rect
          width={pageWidth * scale}
          height={pageHeight * scale}
          fill="#f9fafb"
        />
        
        {/* Render all labels */}
        {renderLabels()}
        
        {/* Show margin guides */}
        <line
          x1={0}
          y1={marginTop * scale}
          x2={pageWidth * scale}
          y2={marginTop * scale}
          stroke="#ff7875"
          strokeWidth="0.5"
          strokeDasharray="4,2"
          opacity="0.5"
        />
        <line
          x1={marginLeft * scale}
          y1={0}
          x2={marginLeft * scale}
          y2={pageHeight * scale}
          stroke="#ff7875"
          strokeWidth="0.5"
          strokeDasharray="4,2"
          opacity="0.5"
        />
      </svg>
      
      <div className="mt-4 text-xs text-gray-600 space-y-1">
        <div>Sheet: {pageWidth} × {pageHeight}mm</div>
        <div>Labels: {columns} × {rows} = {columns * rows} labels</div>
        <div>Label size: {labelWidth} × {labelHeight}mm</div>
        <div>Margins: {marginTop}mm top, {marginLeft}mm left</div>
        <div>Spacing: {spacingX}mm horizontal, {spacingY}mm vertical</div>
      </div>
    </div>
  );
};

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

interface MediaTemplateManagerProps {
  onMediaSelect?: (media: MediaType) => void;
  selectedMediaId?: number;
}

export default function MediaTemplateManager({ onMediaSelect, selectedMediaId }: MediaTemplateManagerProps) {
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    pageWidth: 210,
    pageHeight: 297,
    labelWidth: 63.5,
    labelHeight: 38.1,
    columns: 3,
    rows: 7,
    marginTop: 15,
    marginLeft: 7,
    spacingX: 2.5,
    spacingY: 0,
    orientation: 'portrait' as 'portrait' | 'landscape',
    description: '',
    manufacturer: 'Avery'
  });

  useEffect(() => {
    fetchMediaTypes();
  }, []);

  const fetchMediaTypes = async () => {
    try {
      const response = await fetch('/api/labels/media-types');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMediaTypes(data.data);
          console.log('🏷️ Media types loaded:', data.data.length);
        }
      }
    } catch (error) {
      console.error('Error fetching media types:', error);
      toast.error('Failed to load media types');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const mediaData = {
      name: formData.name,
      code: formData.code,
      dimensions: {
        pageWidth: formData.pageWidth,
        pageHeight: formData.pageHeight,
        labelWidth: formData.labelWidth,
        labelHeight: formData.labelHeight,
        columns: formData.columns,
        rows: formData.rows,
        marginTop: formData.marginTop,
        marginLeft: formData.marginLeft,
        spacingX: formData.spacingX,
        spacingY: formData.spacingY
      },
      orientation: formData.orientation,
      description: formData.description,
      manufacturer: formData.manufacturer,
      isActive: true
    };

    try {
      const url = editingMedia 
        ? `/api/labels/media-types/${editingMedia.id}`
        : '/api/labels/media-types';
      
      const response = await fetch(url, {
        method: editingMedia ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mediaData)
      });

      if (response.ok) {
        toast.success(editingMedia ? 'Media type updated' : 'Media type created');
        setShowAddModal(false);
        setEditingMedia(null);
        resetForm();
        fetchMediaTypes();
      } else {
        toast.error('Failed to save media type');
      }
    } catch (error) {
      console.error('Error saving media type:', error);
      toast.error('Error saving media type');
    }
  };

  const handleDelete = async (media: MediaType) => {
    if (!confirm(`Delete "${media.name}"? This will affect any templates using this media type.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/labels/media-types/${media.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Media type deleted');
        fetchMediaTypes();
      } else {
        toast.error('Failed to delete media type');
      }
    } catch (error) {
      console.error('Error deleting media type:', error);
      toast.error('Error deleting media type');
    }
  };

  const handleEdit = (media: MediaType) => {
    setEditingMedia(media);
    setFormData({
      name: media.name || '',
      code: media.code || '',
      pageWidth: media.dimensions?.pageWidth || 210,
      pageHeight: media.dimensions?.pageHeight || 297,
      labelWidth: media.dimensions?.labelWidth || 63.5,
      labelHeight: media.dimensions?.labelHeight || 38.1,
      columns: media.dimensions?.columns || 3,
      rows: media.dimensions?.rows || 7,
      marginTop: media.dimensions?.marginTop || 15,
      marginLeft: media.dimensions?.marginLeft || 7,
      spacingX: media.dimensions?.spacingX || 2.5,
      spacingY: media.dimensions?.spacingY || 0,
      orientation: media.orientation || 'portrait',
      description: media.description || '',
      manufacturer: media.manufacturer || 'Avery'
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      pageWidth: 210,
      pageHeight: 297,
      labelWidth: 63.5,
      labelHeight: 38.1,
      columns: 3,
      rows: 7,
      marginTop: 15,
      marginLeft: 7,
      spacingX: 2.5,
      spacingY: 0,
      orientation: 'portrait',
      description: '',
      manufacturer: 'Avery'
    });
  };

  const calculateLabelsPerSheet = (media: MediaType) => {
    return media.dimensions.columns * media.dimensions.rows;
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Media Templates</h3>
          <p className="text-sm text-gray-600">Avery label formats and paper dimensions</p>
        </div>
        <button
          onClick={() => {
            setEditingMedia(null);
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Media Type
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaTypes.map((media) => (
            <div
              key={media.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedMediaId === media.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onMediaSelect?.(media)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <RectangleStackIcon className="w-5 h-5 text-gray-400 mr-2" />
                  <h4 className="font-medium text-gray-900">{media.name}</h4>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(media);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(media);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{media.code}</div>
                <div>Label: {media.dimensions.labelWidth} × {media.dimensions.labelHeight}mm</div>
                <div>Sheet: {media.dimensions.pageWidth} × {media.dimensions.pageHeight}mm</div>
                <div>Layout: {media.dimensions.columns} × {media.dimensions.rows} ({calculateLabelsPerSheet(media)} labels/sheet)</div>
                <div className="text-xs text-gray-500">{media.manufacturer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {editingMedia ? 'Edit Media Type' : 'Add New Media Type'}
              </h3>
            </div>
            
            <div className="flex h-[calc(90vh-80px)]">
              <form onSubmit={handleSubmit} className="w-1/2 p-6 space-y-4 overflow-y-auto border-r border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., J8160 - 21 Address Labels"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., J8160"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Width (mm)</label>
                  <input
                    type="number"
                    value={formData.pageWidth}
                    onChange={(e) => setFormData({ ...formData, pageWidth: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Height (mm)</label>
                  <input
                    type="number"
                    value={formData.pageHeight}
                    onChange={(e) => setFormData({ ...formData, pageHeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label Width (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.labelWidth}
                    onChange={(e) => setFormData({ ...formData, labelWidth: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label Height (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.labelHeight}
                    onChange={(e) => setFormData({ ...formData, labelHeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                  <input
                    type="number"
                    value={formData.columns}
                    onChange={(e) => setFormData({ ...formData, columns: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                  <input
                    type="number"
                    value={formData.rows}
                    onChange={(e) => setFormData({ ...formData, rows: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Margin Top (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.marginTop}
                    onChange={(e) => setFormData({ ...formData, marginTop: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Margin Left (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.marginLeft}
                    onChange={(e) => setFormData({ ...formData, marginLeft: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spacing X (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.spacingX}
                    onChange={(e) => setFormData({ ...formData, spacingX: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spacing Y (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.spacingY}
                    onChange={(e) => setFormData({ ...formData, spacingY: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMedia(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingMedia ? 'Update' : 'Create'} Media Type
                </button>
              </div>
            </form>
            
            {/* Live Preview Panel */}
            <div className="w-1/2 p-6 bg-gray-50 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Live Preview</h4>
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-center">
                <LiveLabelPreview 
                  pageWidth={formData.pageWidth}
                  pageHeight={formData.pageHeight}
                  labelWidth={formData.labelWidth}
                  labelHeight={formData.labelHeight}
                  columns={formData.columns}
                  rows={formData.rows}
                  marginTop={formData.marginTop}
                  marginLeft={formData.marginLeft}
                  spacingX={formData.spacingX}
                  spacingY={formData.spacingY}
                />
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}