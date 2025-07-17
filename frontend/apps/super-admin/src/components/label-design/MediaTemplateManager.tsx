import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Live Label Preview Component
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

const LiveLabelPreview = ({
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
}: LiveLabelPreviewProps) => {
  // Scale for visualization (A4 at 210x297mm should fit nicely)
  const scale = Math.min(400 / pageWidth, 550 / pageHeight);
  
  const labels = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = marginLeft + col * (labelWidth + spacingX);
      const y = marginTop + row * (labelHeight + spacingY);
      labels.push({ x, y, row, col });
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative bg-white shadow-xl"
        style={{
          width: pageWidth * scale,
          height: pageHeight * scale,
          border: '2px solid #e5e7eb'
        }}
      >
        {/* Margin guides */}
        <div
          className="absolute border-l-2 border-t-2 border-dashed border-red-300"
          style={{
            left: 0,
            top: 0,
            width: marginLeft * scale,
            height: marginTop * scale
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
              width: labelWidth * scale,
              height: labelHeight * scale
            }}
          >
            {label.row + 1},{label.col + 1}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600 space-y-1">
        <div>Page: {pageWidth} × {pageHeight}mm</div>
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
          // Map backend response to frontend interface
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
          console.log('🏷️ Media types loaded:', mappedMediaTypes.length);
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
    
    try {
      const url = editingMedia 
        ? `/api/labels/media-types/${editingMedia.id}`
        : '/api/labels/media-types';
      
      const method = editingMedia ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          productCode: formData.code, // Map code to productCode
          physicalProperties: {
            pageWidth: formData.pageWidth,
            pageHeight: formData.pageHeight,
            labelWidth: formData.labelWidth,
            labelHeight: formData.labelHeight,
            labelsPerRow: formData.columns, // Map columns to labelsPerRow
            labelsPerColumn: formData.rows, // Map rows to labelsPerColumn
            totalLabelsPerSheet: formData.columns * formData.rows,
            marginTop: formData.marginTop,
            marginLeft: formData.marginLeft,
            marginRight: formData.marginTop,
            marginBottom: formData.marginLeft,
            horizontalSpacing: formData.spacingX, // Map spacingX to horizontalSpacing
            verticalSpacing: formData.spacingY // Map spacingY to verticalSpacing
          },
          mediaType: "sheet",
          orientation: formData.orientation,
          description: formData.description || `${formData.columns}×${formData.rows} labels per sheet`,
          manufacturer: formData.manufacturer,
          isActive: true
        })
      });

      if (response.ok) {
        toast.success(editingMedia ? 'Media type updated!' : 'Media type created!');
        setShowAddModal(false);
        resetForm();
        fetchMediaTypes();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save media type');
      }
    } catch (error) {
      console.error('Error saving media type:', error);
      toast.error('Failed to save media type');
    }
  };

  const handleDelete = async (media: MediaType) => {
    if (!confirm(`Delete media type "${media.name}"?`)) return;
    
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
      toast.error('Failed to delete media type');
    }
  };

  const handleEdit = (media: MediaType) => {
    console.log('🔧 Edit button clicked for media:', media.name);
    setEditingMedia(media);
    setFormData({
      name: media.name,
      code: media.code,
      pageWidth: media.dimensions.pageWidth,
      pageHeight: media.dimensions.pageHeight,
      labelWidth: media.dimensions.labelWidth,
      labelHeight: media.dimensions.labelHeight,
      columns: media.dimensions.columns,
      rows: media.dimensions.rows,
      marginTop: media.dimensions.marginTop,
      marginLeft: media.dimensions.marginLeft,
      spacingX: media.dimensions.spacingX,
      spacingY: media.dimensions.spacingY,
      orientation: media.orientation,
      description: media.description || '',
      manufacturer: media.manufacturer || 'Avery'
    });
    setShowAddModal(true);
    console.log('✅ Edit modal should now be visible');
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
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => {
                console.log('📱 Media card clicked:', media.name);
                onMediaSelect && onMediaSelect(media);
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{media.name}</h4>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleEdit(media);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit media template"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDelete(media);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete media template"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g., Avery"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Page Dimensions</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Width (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.pageWidth}
                        onChange={(e) => setFormData({ ...formData, pageWidth: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Height (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.pageHeight}
                        onChange={(e) => setFormData({ ...formData, pageHeight: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Orientation</label>
                      <select
                        value={formData.orientation}
                        onChange={(e) => setFormData({ ...formData, orientation: e.target.value as 'portrait' | 'landscape' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Label Dimensions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Label Width (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.labelWidth}
                        onChange={(e) => setFormData({ ...formData, labelWidth: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Label Height (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.labelHeight}
                        onChange={(e) => setFormData({ ...formData, labelHeight: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Label Layout</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Columns</label>
                      <input
                        type="number"
                        value={formData.columns}
                        onChange={(e) => setFormData({ ...formData, columns: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Rows</label>
                      <input
                        type="number"
                        value={formData.rows}
                        onChange={(e) => setFormData({ ...formData, rows: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Margins & Spacing</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Top Margin (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.marginTop}
                        onChange={(e) => setFormData({ ...formData, marginTop: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Left Margin (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.marginLeft}
                        onChange={(e) => setFormData({ ...formData, marginLeft: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Horizontal Spacing (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.spacingX}
                        onChange={(e) => setFormData({ ...formData, spacingX: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Vertical Spacing (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.spacingY}
                        onChange={(e) => setFormData({ ...formData, spacingY: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Address labels for envelopes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
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