'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface MediaTemplate {
  id: number;
  name: string;
  dimensions: {
    labelWidth: number;
    labelHeight: number;
  };
}

interface MediaTemplateProps {
  onSelect: (template: MediaTemplate) => void;
}

export function MediaTemplateSelector({ onSelect }: MediaTemplateProps) {
  const [mediaTypes, setMediaTypes] = useState<MediaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMediaTypes();
  }, []);

  const fetchMediaTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/labels/media-types');
      const result = await response.json();

      if (result.success) {
        // Transform the data to match our interface
        const transformedData: MediaTemplate[] = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          dimensions: {
            labelWidth: item.dimensions.labelWidth,
            labelHeight: item.dimensions.labelHeight,
          },
        }));
        setMediaTypes(transformedData);
      } else {
        setError('Failed to load media types');
        toast.error('Failed to load media types');
      }
    } catch (error) {
      console.error('Error fetching media types:', error);
      setError('Error loading media types');
      toast.error('Error loading media types');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading media templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchMediaTypes}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaTypes.map(template => (
          <div
            key={template.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelect(template)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                {template.dimensions.labelWidth} × {template.dimensions.labelHeight}mm
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Width:</span>
                <span className="font-medium">{template.dimensions.labelWidth}mm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Height:</span>
                <span className="font-medium">{template.dimensions.labelHeight}mm</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="w-full py-2 px-4 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
                Select This Media
              </button>
            </div>
          </div>
        ))}
      </div>

      {mediaTypes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No media templates available</p>
        </div>
      )}
    </div>
  );
}
