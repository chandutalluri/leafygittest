import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'react-hot-toast';

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
  totalLabels?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TemplateDesignerProps {
  onClose: () => void;
  onSave: (template: LabelTemplate) => void;
  editTemplate?: LabelTemplate | null;
}

const paperSizes = [
  { value: 'A4', label: 'A4 (210×297mm)', width: 210, height: 297 },
  { value: 'A3', label: 'A3 (297×420mm)', width: 297, height: 420 },
  { value: 'Letter', label: 'Letter (216×279mm)', width: 216, height: 279 },
  { value: 'Legal', label: 'Legal (216×356mm)', width: 216, height: 356 },
  { value: 'Custom', label: 'Custom Size', width: 100, height: 100 }
];

const templateTypes = [
  { value: 'address_label', label: 'Address Label' },
  { value: 'price_tag', label: 'Price Tag' },
  { value: 'product_label', label: 'Product Label' },
  { value: 'barcode_label', label: 'Barcode Label' },
  { value: 'shipping_label', label: 'Shipping Label' },
  { value: 'custom', label: 'Custom Template' }
];

export function TemplateDesigner({ onClose, onSave, editTemplate }: TemplateDesignerProps) {
  const [template, setTemplate] = useState<LabelTemplate>({
    name: '',
    description: '',
    paperSize: 'A4',
    paperWidth: 210,
    paperHeight: 297,
    labelWidth: 60,
    labelHeight: 30,
    horizontalCount: 3,
    verticalCount: 4,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
    horizontalGap: 5,
    verticalGap: 5,
    cornerRadius: 0,
    templateType: 'product_label'
  });

  useEffect(() => {
    if (editTemplate) {
      setTemplate(editTemplate);
    }
  }, [editTemplate]);

  const handlePaperSizeChange = (value: string) => {
    const paperSize = paperSizes.find(p => p.value === value);
    if (paperSize && value !== 'Custom') {
      setTemplate(prev => ({
        ...prev,
        paperSize: value,
        paperWidth: paperSize.width,
        paperHeight: paperSize.height
      }));
    } else {
      setTemplate(prev => ({
        ...prev,
        paperSize: value
      }));
    }
  };

  const handleInputChange = (field: keyof LabelTemplate, value: string | number) => {
    // Handle numeric fields with proper validation to prevent NaN
    if (typeof value === 'number' && isNaN(value)) {
      return; // Don't update state with NaN values
    }
    
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Safe number parsing helpers
  const safeParseFloat = (value: string, defaultValue: number = 0): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const safeParseInt = (value: string, defaultValue: number = 1): number => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const calculateTotalLabels = () => {
    return template.horizontalCount * template.verticalCount;
  };

  const validateTemplate = () => {
    if (!template.name.trim()) {
      toast.error('Template name is required');
      return false;
    }

    if (template.labelWidth >= template.paperWidth) {
      toast.error('Label width must be smaller than paper width');
      return false;
    }

    if (template.labelHeight >= template.paperHeight) {
      toast.error('Label height must be smaller than paper height');
      return false;
    }

    const totalWidth = (template.labelWidth * template.horizontalCount) + 
                      (template.horizontalGap * (template.horizontalCount - 1)) + 
                      template.marginLeft + template.marginRight;
    
    const totalHeight = (template.labelHeight * template.verticalCount) + 
                       (template.verticalGap * (template.verticalCount - 1)) + 
                       template.marginTop + template.marginBottom;

    if (totalWidth > template.paperWidth) {
      toast.error('Labels exceed paper width. Reduce label count, size, or margins.');
      return false;
    }

    if (totalHeight > template.paperHeight) {
      toast.error('Labels exceed paper height. Reduce label count, size, or margins.');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (validateTemplate()) {
      onSave(template);
      onClose();
      toast.success(`Template ${editTemplate ? 'updated' : 'created'} successfully`);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
        <DialogHeader className="bg-gray-50 -m-6 mb-6 p-6 border-b border-gray-200">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {editTemplate ? 'Edit Custom Template' : 'Create New Custom Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
          {/* Basic Information */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Template Information</h3>
            
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">Template Name</Label>
              <Input
                value={template.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter template name"
                className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
              <Textarea
                value={template.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter template description"
                rows={3}
                className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="templateType" className="text-gray-700 font-medium">Template Type</Label>
              <Select value={template.templateType} onValueChange={(value) => handleInputChange('templateType', value)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {templateTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} className="text-gray-900">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Paper Settings */}
            <h3 className="text-lg font-semibold mt-6 text-gray-900 border-b border-gray-200 pb-2">Paper Settings</h3>
            
            <div>
              <Label htmlFor="paperSize" className="text-gray-700 font-medium">Paper Size</Label>
              <Select value={template.paperSize} onValueChange={handlePaperSizeChange}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select paper size" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {paperSizes.map(size => (
                    <SelectItem key={size.value} value={size.value} className="text-gray-900">
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paperWidth" className="text-gray-700 font-medium">Paper Width (mm)</Label>
                <Input
                  type="number"
                  value={template.paperWidth || ''}
                  onChange={(e) => handleInputChange('paperWidth', safeParseFloat(e.target.value, template.paperWidth || 210))}
                  disabled={template.paperSize !== 'Custom'}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="paperHeight" className="text-gray-700 font-medium">Paper Height (mm)</Label>
                <Input
                  type="number"
                  value={template.paperHeight || ''}
                  onChange={(e) => handleInputChange('paperHeight', safeParseFloat(e.target.value, template.paperHeight || 297))}
                  disabled={template.paperSize !== 'Custom'}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Label Layout */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Label Layout</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="labelWidth" className="text-gray-700 font-medium">Label Width (mm)</Label>
                <Input
                  type="number"
                  value={template.labelWidth || ''}
                  onChange={(e) => handleInputChange('labelWidth', safeParseFloat(e.target.value, template.labelWidth || 60))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="labelHeight" className="text-gray-700 font-medium">Label Height (mm)</Label>
                <Input
                  type="number"
                  value={template.labelHeight || ''}
                  onChange={(e) => handleInputChange('labelHeight', safeParseFloat(e.target.value, template.labelHeight || 30))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horizontalCount" className="text-gray-700 font-medium">Columns</Label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={template.horizontalCount || ''}
                  onChange={(e) => handleInputChange('horizontalCount', safeParseInt(e.target.value, template.horizontalCount || 3))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="verticalCount" className="text-gray-700 font-medium">Rows</Label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={template.verticalCount || ''}
                  onChange={(e) => handleInputChange('verticalCount', safeParseInt(e.target.value, template.verticalCount || 4))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900">
                Total Labels: {calculateTotalLabels()}
              </p>
              <p className="text-xs text-blue-700">
                {template.horizontalCount} × {template.verticalCount} = {calculateTotalLabels()} labels per sheet
              </p>
            </div>

            {/* Margins */}
            <h3 className="text-lg font-semibold mt-6 text-gray-900 border-b border-gray-200 pb-2">Margins (mm)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marginTop" className="text-gray-700 font-medium">Top Margin</Label>
                <Input
                  type="number"
                  value={template.marginTop || ''}
                  onChange={(e) => handleInputChange('marginTop', safeParseFloat(e.target.value, template.marginTop || 15))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="marginBottom" className="text-gray-700 font-medium">Bottom Margin</Label>
                <Input
                  type="number"
                  value={template.marginBottom || ''}
                  onChange={(e) => handleInputChange('marginBottom', safeParseFloat(e.target.value, template.marginBottom || 15))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marginLeft" className="text-gray-700 font-medium">Left Margin</Label>
                <Input
                  type="number"
                  value={template.marginLeft || ''}
                  onChange={(e) => handleInputChange('marginLeft', safeParseFloat(e.target.value, template.marginLeft || 10))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="marginRight" className="text-gray-700 font-medium">Right Margin</Label>
                <Input
                  type="number"
                  value={template.marginRight || ''}
                  onChange={(e) => handleInputChange('marginRight', safeParseFloat(e.target.value, template.marginRight || 10))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Gaps */}
            <h3 className="text-lg font-semibold mt-6 text-gray-900 border-b border-gray-200 pb-2">Label Gaps (mm)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horizontalGap" className="text-gray-700 font-medium">Horizontal Gap</Label>
                <Input
                  type="number"
                  value={template.horizontalGap || ''}
                  onChange={(e) => handleInputChange('horizontalGap', safeParseFloat(e.target.value, template.horizontalGap || 5))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="verticalGap" className="text-gray-700 font-medium">Vertical Gap</Label>
                <Input
                  type="number"
                  value={template.verticalGap || ''}
                  onChange={(e) => handleInputChange('verticalGap', safeParseFloat(e.target.value, template.verticalGap || 5))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cornerRadius" className="text-gray-700 font-medium">Corner Radius (mm)</Label>
              <Input
                type="number"
                value={template.cornerRadius || ''}
                onChange={(e) => handleInputChange('cornerRadius', safeParseFloat(e.target.value, template.cornerRadius || 0))}
                className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="bg-gray-50 -m-6 mt-6 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
            {editTemplate ? 'Update Template' : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}