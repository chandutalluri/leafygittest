"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface TemplateLibraryProps {
  mediaId: number;
  onSelect: (template: any) => void;
}

export function TemplateLibrary({ mediaId, onSelect }: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, [mediaId]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/labels/custom-templates?mediaId=${mediaId}`);
      const result = await response.json();
      
      if (result.success) {
        setTemplates(result.data || []);
      } else {
        toast.error('Failed to load templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Error loading templates');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No templates available for this media type</p>
          <p className="text-sm text-gray-500 mt-2">Create your first template to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelect(template)}
            >
              <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {template.templateJson.elements.length} elements
                </span>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}