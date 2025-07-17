import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, TrashIcon, PencilIcon, EyeIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface CanvasElement {
  id: string;
  type: 'text' | 'qr' | 'barcode' | 'image' | 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  [key: string]: any;
}

interface LabelTemplate {
  id: number;
  name: string;
  description?: string;
  type: string;
  mediaId: number;
  templateJson: {
    elements: CanvasElement[];
    labelSettings: {
      backgroundColor: string;
      borderStyle: string;
      borderWidth: number;
      borderColor: string;
    };
  };
  createdAt: string;
  isActive: boolean;
  usageCount?: number;
}

interface MediaType {
  id: number;
  name: string;
  dimensions: {
    labelWidth: number;
    labelHeight: number;
  };
}

interface LabelTemplateManagerProps {
  onTemplateLoad?: (template: LabelTemplate) => void;
  selectedMediaId?: number;
  mediaTypes: MediaType[];
}

export default function LabelTemplateManager({ 
  onTemplateLoad, 
  selectedMediaId, 
  mediaTypes 
}: LabelTemplateManagerProps) {
  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<LabelTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<LabelTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'product_label',
    mediaId: selectedMediaId || 0
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedMediaId && !formData.mediaId) {
      setFormData(prev => ({ ...prev, mediaId: selectedMediaId }));
    }
  }, [selectedMediaId]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/labels/custom-templates');
      if (response.ok) {
        const data = await response.json();
        const templatesArray = Array.isArray(data) ? data : 
                              (data.data && Array.isArray(data.data)) ? data.data : 
                              (data.templates || []);
        setTemplates(templatesArray);
        console.log('🏷️ Label templates loaded:', templatesArray.length);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    if (!selectedMediaId) {
      toast.error('Please select a media type first');
      return;
    }
    setEditingTemplate(null);
    setFormData({
      name: '',
      description: '',
      type: 'product_label',
      mediaId: selectedMediaId
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const templateData = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      mediaId: formData.mediaId,
      templateJson: {
        elements: [], // Empty template to start with
        labelSettings: {
          backgroundColor: '#ffffff',
          borderStyle: 'solid',
          borderWidth: 0,
          borderColor: '#000000'
        }
      },
      createdBy: 1,
      companyId: 1,
      branchId: 1,
      isActive: true
    };

    try {
      const url = editingTemplate 
        ? `/api/labels/custom-templates/${editingTemplate.id}`
        : '/api/labels/custom-templates';
      
      const response = await fetch(url, {
        method: editingTemplate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(editingTemplate ? 'Template updated' : 'Template created');
        setShowAddModal(false);
        setEditingTemplate(null);
        resetForm();
        fetchTemplates();
        
        // If creating new template, open it in designer
        if (!editingTemplate && result.data) {
          // Ensure the template has the correct structure for the designer
          const normalizedTemplate = {
            ...result.data,
            templateJson: result.data.template_data || { elements: [], labelSettings: {} }
          };
          onTemplateLoad?.(normalizedTemplate);
        }
      } else {
        toast.error('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error saving template');
    }
  };

  const handleDelete = async (template: LabelTemplate) => {
    if (!confirm(`Delete "${template.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/labels/custom-templates/${template.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Template deleted');
        fetchTemplates();
      } else {
        toast.error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Error deleting template');
    }
  };

  const handleEdit = (template: LabelTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      type: template.type,
      mediaId: template.mediaId
    });
    setShowAddModal(true);
  };

  const handleDuplicate = async (template: LabelTemplate) => {
    const duplicateData = {
      name: `${template.name} (Copy)`,
      description: template.description,
      type: template.type,
      mediaId: template.mediaId,
      templateJson: template.templateJson,
      createdBy: 1,
      companyId: 1,
      branchId: 1,
      isActive: true
    };

    try {
      const response = await fetch('/api/labels/custom-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      });

      if (response.ok) {
        toast.success('Template duplicated');
        fetchTemplates();
      } else {
        toast.error('Failed to duplicate template');
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Error duplicating template');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'product_label',
      mediaId: selectedMediaId || 0
    });
  };

  const getMediaName = (mediaId: number) => {
    const media = mediaTypes.find(m => m.id === mediaId);
    return media ? media.name : `Media #${mediaId}`;
  };

  const getElementsPreview = (template: LabelTemplate) => {
    const elementCount = template.templateJson?.elements?.length || 0;
    const types = new Set(template.templateJson?.elements?.map(el => el.type) || []);
    return `${elementCount} elements (${Array.from(types).join(', ')})`;
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div></div>;
  }

  // Filter templates by selected media type if provided
  const filteredTemplates = selectedMediaId 
    ? templates.filter(t => t.mediaId === selectedMediaId)
    : templates;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Label Templates</h3>
          <p className="text-sm text-gray-600">
            {selectedMediaId 
              ? `Templates for ${getMediaName(selectedMediaId)} (${filteredTemplates.length})`
              : `All label templates (${templates.length})`
            }
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          disabled={!selectedMediaId}
          className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          New Template
        </button>
      </div>

      <div className="p-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              {selectedMediaId 
                ? 'Create your first label template for this media type'
                : 'Select a media type to view and create templates'
              }
            </p>
            {selectedMediaId && (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create First Template
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:border-gray-300 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                    <div className="text-xs text-gray-500 mb-2">
                      {getMediaName(template.mediaId)}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Preview"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(template)}
                      className="p-1 text-gray-400 hover:text-emerald-600"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(template)}
                      className="p-1 text-gray-400 hover:text-purple-600"
                      title="Duplicate"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="truncate">{template.description || 'No description'}</div>
                  <div className="text-xs">
                    <span className="inline-block bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {template.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {getElementsPreview(template)}
                  </div>
                  <div className="text-xs text-gray-400">
                    Created: {new Date(template.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => onTemplateLoad?.(template)}
                    className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 text-sm font-medium"
                  >
                    Load in Designer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Product Price Tag"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of this template"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="product_label">Product Label</option>
                  <option value="price_tag">Price Tag</option>
                  <option value="barcode_label">Barcode Label</option>
                  <option value="shipping_label">Shipping Label</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                <select
                  value={formData.mediaId}
                  onChange={(e) => setFormData({ ...formData, mediaId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Media Type</option>
                  {mediaTypes.map((media) => (
                    <option key={media.id} value={media.id}>
                      {media.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTemplate(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  {editingTemplate ? 'Update' : 'Create & Open'} Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Preview: {previewTemplate.name}</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">👁️</div>
                <p className="text-gray-600 mb-4">Template preview will be implemented</p>
                <div className="text-sm text-gray-500">
                  Elements: {getElementsPreview(previewTemplate)}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onTemplateLoad?.(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  Load in Designer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}