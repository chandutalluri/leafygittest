import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'react-hot-toast';
import { Plus, Search, Edit, Copy, Trash2, Eye, Grid, Ruler } from 'lucide-react';
import { TemplateDesigner } from './TemplateDesigner';

interface LabelTemplate {
  id?: number;
  name: string;
  description: string;
  paperSize: string;
  paperWidth: number;
  paperHeight: number;
  labelWidth: number;
  labelHeight: number;
  horizontalCount: number;
  verticalCount: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  horizontalGap: number;
  verticalGap: number;
  cornerRadius: number;
  templateType: string;
  createdAt?: string;
  updatedAt?: string;
  totalLabels?: number;
}

interface TemplateManagerProps {
  templates?: LabelTemplate[];
  onTemplateSelect?: (template: LabelTemplate) => void;
  onTemplateCreated?: () => void;
  onRefresh?: () => void;
}

export function TemplateManager({ 
  templates: propTemplates, 
  onTemplateSelect, 
  onTemplateCreated, 
  onRefresh 
}: TemplateManagerProps = {}) {
  const [templates, setTemplates] = useState<LabelTemplate[]>(propTemplates || []);
  const [filteredTemplates, setFilteredTemplates] = useState<LabelTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(!propTemplates);
  const [showDesigner, setShowDesigner] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<LabelTemplate | null>(null);

  useEffect(() => {
    if (propTemplates) {
      setTemplates(propTemplates);
      setIsLoading(false);
    } else {
      fetchTemplates();
    }
  }, [propTemplates]);

  useEffect(() => {
    filterTemplates();
  }, [searchTerm, templates]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/labels/custom-templates');
      const data = await response.json();
      
      if (response.ok) {
        const templatesArray = Array.isArray(data) ? data : (data.data || []);
        const templatesWithTotalLabels = templatesArray.map((template: any) => ({
          id: template.id,
          name: template.name || 'Unnamed Template',
          description: template.description || 'No description provided',
          totalLabels: (template.horizontal_count || 1) * (template.vertical_count || 1),
          paperSize: template.paper_size || 'A4',
          paperWidth: parseFloat(template.paper_width || '210'),
          paperHeight: parseFloat(template.paper_height || '297'),
          labelWidth: parseFloat(template.label_width || '50'),
          labelHeight: parseFloat(template.label_height || '25'),
          horizontalCount: template.horizontal_count || 1,
          verticalCount: template.vertical_count || 1,
          marginTop: parseFloat(template.margin_top || '10'),
          marginBottom: parseFloat(template.margin_bottom || '10'),
          marginLeft: parseFloat(template.margin_left || '10'),
          marginRight: parseFloat(template.margin_right || '10'),
          horizontalGap: parseFloat(template.horizontal_gap || '3'),
          verticalGap: parseFloat(template.vertical_gap || '3'),
          cornerRadius: parseFloat(template.corner_radius || '0'),
          templateType: template.template_type || 'product_label',
          createdAt: template.created_at || new Date().toISOString(),
          updatedAt: template.updated_at || new Date().toISOString()
        }));
        setTemplates(templatesWithTotalLabels);
      } else {
        toast.error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Error fetching templates');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    if (!searchTerm) {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.templateType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.paperSize.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTemplates(filtered);
    }
  };

  const handleCreateTemplate = async (template: LabelTemplate) => {
    try {
      const response = await fetch('/api/labels/custom-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          paperSize: template.paperSize,
          paperWidth: template.paperWidth,
          paperHeight: template.paperHeight,
          labelWidth: template.labelWidth,
          labelHeight: template.labelHeight,
          horizontalCount: template.horizontalCount,
          verticalCount: template.verticalCount,
          marginTop: template.marginTop,
          marginBottom: template.marginBottom,
          marginLeft: template.marginLeft,
          marginRight: template.marginRight,
          horizontalGap: template.horizontalGap,
          verticalGap: template.verticalGap,
          cornerRadius: template.cornerRadius || 0,
          templateType: template.templateType,
          createdBy: 1, // TODO: Get from auth context
          companyId: 1,
          branchId: 1
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Template created successfully');
        setShowDesigner(false);
        if (onTemplateCreated) {
          onTemplateCreated();
        } else {
          fetchTemplates();
        }
      } else {
        toast.error(data.message || 'Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Error creating template');
    }
  };

  const handleEditTemplate = (template: LabelTemplate) => {
    setEditingTemplate(template);
    setShowDesigner(true);
  };

  const handleUpdateTemplate = async (template: LabelTemplate) => {
    try {
      const response = await fetch(`/api/labels/templates/${template.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...template,
          createdBy: 1, // TODO: Get from auth context
          companyId: 1,
          branchId: 1
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Template updated successfully');
        fetchTemplates();
        setEditingTemplate(null);
      } else {
        toast.error(data.error || 'Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Error updating template');
    }
  };

  const handleDuplicateTemplate = async (template: LabelTemplate) => {
    const duplicatedTemplate: LabelTemplate = {
      ...template,
      id: undefined,
      name: `${template.name} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined
    };
    
    await handleCreateTemplate(duplicatedTemplate);
  };

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      const response = await fetch(`/api/labels/templates/${templateId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Template deleted successfully');
        fetchTemplates();
      } else {
        toast.error(data.error || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Error deleting template');
    }
  };

  const formatTemplateType = (type: string | undefined) => {
    if (!type) return 'Custom Template';
    
    const typeMap: { [key: string]: string } = {
      'price_tag': 'Price Tag',
      'product_label': 'Product Label',
      'barcode_label': 'Barcode Label',
      'nutrition_label': 'Nutrition Label',
      'organic_certification': 'Organic Certificate',
      'custom': 'Custom Design'
    };
    
    return typeMap[type] || type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getTemplateTypeColor = (type: string | undefined) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    
    const colorMap: { [key: string]: string } = {
      'price_tag': 'bg-green-100 text-green-800',
      'product_label': 'bg-blue-100 text-blue-800',
      'barcode_label': 'bg-purple-100 text-purple-800',
      'nutrition_label': 'bg-orange-100 text-orange-800',
      'organic_certification': 'bg-emerald-100 text-emerald-800',
      'custom': 'bg-gray-100 text-gray-800'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  const handlePreviewTemplate = (template: LabelTemplate) => {
    // Template-specific preview actions based on type
    const templateType = template.templateType || 'custom';
    
    switch (templateType) {
      case 'price_tag':
        toast.success(`Previewing price tag template: ${template.name}`);
        break;
      case 'product_label':
        toast.success(`Previewing product label template: ${template.name}`);
        break;
      case 'barcode_label':
        toast.success(`Previewing barcode label template: ${template.name}`);
        break;
      case 'nutrition_label':
        toast.success(`Previewing nutrition label template: ${template.name}`);
        break;
      case 'organic_certification':
        toast.success(`Previewing organic certification template: ${template.name}`);
        break;
      default:
        toast.success(`Previewing custom template: ${template.name}`);
    }
    
    // Here you could implement specific preview logic for each template type
    console.log(`Previewing ${templateType} template:`, template);
  };

  const renderTemplateCard = (template: LabelTemplate) => (
    <Card key={template.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
          </div>
          <Badge className={getTemplateTypeColor(template.templateType)}>
            {formatTemplateType(template.templateType)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Template Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{template.totalLabels} labels</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-green-500" />
              <span>{template.paperSize}</span>
            </div>
          </div>

          {/* Layout Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Layout: {template.horizontalCount}×{template.verticalCount}</div>
              <div>Size: {template.labelWidth}×{template.labelHeight}mm</div>
              <div>Paper: {template.paperWidth}×{template.paperHeight}mm</div>
              <div>Margins: {template.marginTop}mm</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-3 border-t">
            <div className="text-xs text-gray-500">
              Created {new Date(template.createdAt || '').toLocaleDateString()}
            </div>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePreviewTemplate(template)}
                className="h-8 w-8 p-0"
              >
                <Eye className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTemplateSelect ? onTemplateSelect(template) : handleEditTemplate(template)}
                className="h-8 w-8 p-0"
                title={onTemplateSelect ? "Load Template" : "Edit Template"}
              >
                <Edit className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDuplicateTemplate(template)}
                className="h-8 w-8 p-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Template</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{template.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteTemplate(template.id!)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Template Management</h2>
          <p className="text-gray-600">Create and manage custom label templates with precise dimensions</p>
        </div>
        
        <Button 
          onClick={() => {
            setEditingTemplate(null);
            setShowDesigner(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
            <div className="text-sm text-gray-600">Total Templates</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {templates.filter(t => t.templateType === 'product_label').length}
            </div>
            <div className="text-sm text-gray-600">Product Labels</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {templates.filter(t => t.paperSize === 'A4').length}
            </div>
            <div className="text-sm text-gray-600">A4 Templates</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(templates.reduce((acc, t) => acc + (t.totalLabels || 0), 0) / templates.length) || 0}
            </div>
            <div className="text-sm text-gray-600">Avg Labels/Sheet</div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {searchTerm ? 'No templates found' : 'No templates created'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first custom template to get started'
            }
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => {
                setEditingTemplate(null);
                setShowDesigner(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(renderTemplateCard)}
        </div>
      )}

      {/* Template Designer Modal */}
      {showDesigner && (
        <TemplateDesigner
          onClose={() => {
            setShowDesigner(false);
            setEditingTemplate(null);
          }}
          onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
          editTemplate={editingTemplate}
        />
      )}
    </div>
  );
}