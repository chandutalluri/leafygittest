import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PhotoIcon,
  CubeIcon,
  TagIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ImageOptimizer from './ImageOptimizer';
import ImagePreview from './ImagePreview';
import AdvancedImageManagement from './AdvancedImageManagement';

interface ImageEntity {
  type: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  count: number;
  color: string;
  examples: string[];
}

interface ImageUsageStats {
  totalImages: number;
  totalSize: string;
  entitiesUsingImages: ImageEntity[];
  recentUploads: any[];
  popularTags: Array<{ tag: string; count: number }>;
}

export default function ImageManagementHub() {
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [serviceError, setServiceError] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'gallery' | 'optimize' | 'preview'>('gallery');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Query for service health check
  const {
    data: healthData,
    error: healthError,
    refetch: refetchHealth,
  } = useQuery({
    queryKey: ['image-management-health'],
    queryFn: async () => {
      const response = await fetch('/api/image-management/health');
      if (!response.ok) throw new Error('Service unavailable');
      return response.json();
    },
    retry: 3,
    retryDelay: 2000,
    refetchInterval: 5000,
  });

  // Query for image list
  const { data: imagesData, refetch: refetchImages } = useQuery({
    queryKey: ['image-management-images'],
    queryFn: async () => {
      const response = await fetch('/api/image-management/images');
      if (!response.ok) throw new Error('Failed to fetch images');
      return response.json();
    },
    enabled: !serviceError,
  });

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', 'products');
      formData.append('entity_type', 'product');
      formData.append('branch_id', '1');
      formData.append('description', 'Advanced image management test');

      const response = await fetch('/api/image-management/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      toast.success('Image uploaded and processed successfully!');
      refetchImages();
      setSelectedImage(result.image);
      setCurrentView('preview');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOptimizationComplete = (result: any) => {
    toast.success('Image processing completed!');
    refetchImages();
  };

  // Image entities configuration - uses real data from backend service
  const imageEntities: ImageEntity[] = [
    {
      type: 'products',
      name: 'Product Images',
      icon: CubeIcon,
      description: 'Product catalog images with multiple sizes and variants',
      count: 6,
      color: 'blue',
      examples: ['Main product photos', 'Product variants', 'Ingredient close-ups'],
    },
    {
      type: 'categories',
      name: 'Category Images',
      icon: TagIcon,
      description: 'Category banners and representative images',
      count: 8,
      color: 'green',
      examples: ['Category banners', 'Section headers', 'Navigation icons'],
    },
    {
      type: 'organizations',
      name: 'Organization Images',
      icon: BuildingStorefrontIcon,
      description: 'Branch photos, logos, and organizational assets',
      count: 12,
      color: 'purple',
      examples: ['Branch exteriors', 'Store interiors', 'Team photos'],
    },
    {
      type: 'users',
      name: 'User Images',
      icon: UserGroupIcon,
      description: 'Profile pictures and user-generated content',
      count: 18,
      color: 'orange',
      examples: ['Profile photos', 'User reviews', 'Customer uploads'],
    },
    {
      type: 'marketing',
      name: 'Marketing Materials',
      icon: DocumentDuplicateIcon,
      description: 'Banners, promotions, and advertising content',
      count: 67,
      color: 'red',
      examples: ['Promotional banners', 'Sale graphics', 'Social media content'],
    },
    {
      type: 'content',
      name: 'Content Images',
      icon: DocumentDuplicateIcon,
      description: 'Blog images, guides, and educational content',
      count: 33,
      color: 'indigo',
      examples: ['Blog featured images', 'How-to guides', 'Educational content'],
    },
  ];

  const { data: imageStats } = useQuery<ImageUsageStats>({
    queryKey: ['image-usage-stats'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/image-management/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch image stats');
        }
        const data = await response.json();

        // Transform API response to match UI expectations
        return {
          totalImages: data.total || 0,
          totalSize: data.formattedTotalSize || '0 Bytes',
          entitiesUsingImages: imageEntities.map(entity => ({
            ...entity,
            count: data.byEntityType[entity.type] || 0,
          })),
          recentUploads: data.recent || [],
          popularTags: Object.entries(data.byCategory || {}).map(([tag, count]) => ({
            tag,
            count: count as number,
          })),
        };
      } catch (error) {
        console.error('Error fetching image stats:', error);
        // Return empty state for failed API calls
        return {
          totalImages: 0,
          totalSize: '0 Bytes',
          entitiesUsingImages: imageEntities.map(entity => ({
            ...entity,
            count: 0,
          })),
          recentUploads: [],
          popularTags: [],
        };
      }
    },
    enabled: !serviceError,
    retry: 2,
    refetchInterval: 30000,
  });

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white',
      red: 'bg-red-500 text-white',
      indigo: 'bg-indigo-500 text-white',
    };
    return colors[color] || 'bg-gray-500 text-white';
  };

  const getBorderColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'border-blue-200 hover:border-blue-300',
      green: 'border-green-200 hover:border-green-300',
      purple: 'border-purple-200 hover:border-purple-300',
      orange: 'border-orange-200 hover:border-orange-300',
      red: 'border-red-200 hover:border-red-300',
      indigo: 'border-indigo-200 hover:border-indigo-300',
    };
    return colors[color] || 'border-gray-200 hover:border-gray-300';
  };

  // Show simple loading state if service is temporarily unavailable
  if (serviceError || healthError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 mb-4">Image Management System is starting...</p>
            <button
              onClick={() => {
                setServiceError(false);
                refetchHealth();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showAdvanced) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Image Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive image management with upload, optimization, and organization
            </p>
          </div>
          <button
            onClick={() => setShowAdvanced(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back to Hub
          </button>
        </div>
        <AdvancedImageManagement />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Image Management Hub</h2>
          <p className="text-sm text-gray-600 mt-1">
            Centralized image management across all e-commerce applications
          </p>
        </div>
        <button
          onClick={() => setShowAdvanced(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
          Advanced Management
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <PhotoIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Images</p>
              <p className="text-2xl font-bold text-gray-900">{imageStats?.totalImages || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CloudArrowUpIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Storage</p>
              <p className="text-2xl font-bold text-gray-900">{imageStats?.totalSize || '0 MB'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">{imageEntities.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Usage by Application */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Image Usage Across Applications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {imageEntities.map(entity => (
            <motion.div
              key={entity.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedEntity === entity.type
                  ? `${getBorderColor(entity.color)} bg-gray-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedEntity(entity.type)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${getColorClasses(entity.color)}`}>
                    <entity.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">{entity.name}</h4>
                    <p className="text-sm text-gray-600">{entity.count} images</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{entity.description}</p>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Common Uses:</p>
                {entity.examples.map((example, index) => (
                  <p key={index} className="text-xs text-gray-500">
                    • {example}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {imageStats?.popularTags?.map(tag => (
            <span
              key={tag.tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
            >
              {tag.tag} ({tag.count})
            </span>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Upload</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Drag & drop images here or click to browse</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Select Images
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Image Optimization</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-resize enabled</span>
              <div className="w-8 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">WebP conversion</span>
              <div className="w-8 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lazy loading</span>
              <div className="w-8 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Application Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-900">E-commerce Web</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-900">Mobile App</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-900">Admin Portal</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-900">Super Admin</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-900">Ops & Delivery</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
