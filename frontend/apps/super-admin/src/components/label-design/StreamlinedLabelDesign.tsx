import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Search, Edit, Copy, Trash2, Eye, Grid, Ruler, FileText, Printer, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfessionalLabelDesigner } from './ProfessionalLabelDesigner';
import { TemplateManager } from './TemplateManager';
import PrintManagement from './PrintManagement';
import LabelAnalytics from './LabelAnalytics';

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
  templateJson?: any;
  createdAt?: string;
  updatedAt?: string;
  totalLabels?: number;
}

export function StreamlinedLabelDesign() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<LabelTemplate | null>(null);
  const [showDesigner, setShowDesigner] = useState(false);
  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/labels/custom-templates');
      const data = await response.json();
      
      if (response.ok) {
        const templatesArray = Array.isArray(data) ? data : (data.data || []);
        setTemplates(templatesArray);
      } else {
        toast.error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Error fetching templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: LabelTemplate) => {
    console.log('🎨 Loading template into Professional Label Designer:', template.name);
    setSelectedTemplate(template);
    setShowDesigner(true);
    setActiveTab('designer');
    toast.success(`Template "${template.name}" loaded in designer`);
  };

  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setShowDesigner(true);
    setActiveTab('designer');
    toast.success('Starting new blank template');
  };

  const handleTemplateCreated = () => {
    fetchTemplates();
    setShowDesigner(false);
    setActiveTab('templates');
    toast.success('Template created successfully');
  };

  const handleTemplateUpdated = () => {
    fetchTemplates();
    setShowDesigner(false);
    setActiveTab('templates');
    toast.success('Template updated successfully');
  };

  const handleDesignerClose = () => {
    setShowDesigner(false);
    setSelectedTemplate(null);
    setActiveTab('templates');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading label design system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Professional Label Design System</h2>
                <p className="text-gray-600">Create, manage, and print professional labels with precision</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleNewTemplate}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <Plus className="w-4 h-4" />
                  New Template
                </Button>
              </div>
            </div>
            
            <TabsList className="grid w-full grid-cols-4 mt-4">
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="designer" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Designer
              </TabsTrigger>
              <TabsTrigger value="print" className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1">
            <TabsContent value="templates" className="h-full m-0">
              <div className="h-full p-6">
                <TemplateManager 
                  templates={templates}
                  onTemplateSelect={handleTemplateSelect}
                  onTemplateCreated={handleTemplateCreated}
                  onRefresh={fetchTemplates}
                />
              </div>
            </TabsContent>

            <TabsContent value="designer" className="h-full m-0">
              <div className="h-full">
                {showDesigner ? (
                  <ProfessionalLabelDesigner
                    selectedTemplate={selectedTemplate}
                    onTemplateCleared={handleDesignerClose}
                    onTemplateSaved={handleTemplateUpdated}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Edit className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No template selected</h3>
                      <p className="text-gray-500 mb-6">Select a template or create a new one to start designing</p>
                      <Button onClick={handleNewTemplate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create New Template
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="print" className="h-full m-0">
              <div className="h-full p-6">
                <PrintManagement templates={templates} />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="h-full m-0">
              <div className="h-full p-6">
                <LabelAnalytics />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}