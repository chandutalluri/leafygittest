import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
// Removed Next.js Image import to use direct img tags for better compatibility
import { motion } from 'framer-motion';
import {
  PhotoIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  FolderIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import ImageUploadModal from './ImageUploadModal';

interface ImageMetadata {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  url: string;
  variants: Array<{
    name: string;
    url: string;
  }>;
}

interface ImageStats {
  total: number;
  totalSize: string;
  categories?: {
    product?: number;
    banner?: number;
    brand?: number;
    icon?: number;
  };
}

export default function ImageManagementCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [previewImage, setPreviewImage] = useState<ImageMetadata | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    dateRange: 'all',
    sizeRange: 'all',
    format: 'all',
    quality: 'all'
  });
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const queryClient = useQueryClient();

  // Fetch image statistics
  const { data: stats } = useQuery({
    queryKey: ['image-stats'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/image-management/stats');
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Stats API error:', errorText);
          throw new Error(`Failed to fetch image stats: ${response.status}`);
        }
        
        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error for stats:', parseError, 'Response:', responseText);
          throw new Error('Invalid JSON response from stats API');
        }
        
        return {
          total: data.totalImages || 0,
          totalSize: data.totalSizeFormatted || '0 B',
          categories: {
            product: data.totalImages || 0,
            banner: 0,
            brand: 0,
            icon: 0,
          }
        };
      } catch (error) {
        console.error('Stats fetch error:', error);
        throw error;
      }
    },
  });

  // Fetch images with advanced filtering
  const { data: images = [], isLoading, refetch } = useQuery<ImageMetadata[]>({
    queryKey: ['images', selectedCategory, searchTerm, filterOptions, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('entityType', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      if (filterOptions.format !== 'all') params.append('format', filterOptions.format);
      if (filterOptions.dateRange !== 'all') params.append('dateRange', filterOptions.dateRange);
      if (filterOptions.sizeRange !== 'all') params.append('sizeRange', filterOptions.sizeRange);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('limit', '50');
      
      const response = await fetch(`/api/image-management/images?${params}`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      
      // The API returns { images: [...], total: N, message: "..." }
      return (data.images || []).map((img: any) => ({
        id: img.id,
        filename: img.filename,
        originalName: img.originalName,
        size: img.size,
        uploadedAt: img.uploadedAt,
        url: img.url,
        variants: img.variants || []
      }));
    },
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const response = await fetch(`/api/image-management/images/${imageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete image');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Image deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['image-stats'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete image: ${error.message}`);
    },
  });

  // Bulk operations
  const bulkDeleteMutation = useMutation({
    mutationFn: async (imageIds: string[]) => {
      try {
        const response = await fetch('/api/image-management/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageIds }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Bulk delete API error:', errorText);
          throw new Error(`Failed to delete images: ${response.status}`);
        }
        
        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error for bulk delete:', parseError, 'Response:', responseText);
          throw new Error('Invalid JSON response from bulk delete API');
        }
        
        return data;
      } catch (error) {
        console.error('Bulk delete error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(`${data.deleted || selectedImages.size} images deleted successfully`);
      setSelectedImages(new Set());
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['image-stats'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const optimizeImagesMutation = useMutation({
    mutationFn: async (imageIds: string[]) => {
      try {
        const response = await fetch('/api/image-management/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageIds }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Optimize API error:', errorText);
          throw new Error(`Failed to optimize images: ${response.status}`);
        }
        
        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error for optimize:', parseError, 'Response:', responseText);
          throw new Error('Invalid JSON response from optimize API');
        }
        
        return data;
      } catch (error) {
        console.error('Optimize error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(`${data.optimized || selectedImages.size} images optimized successfully`);
      setSelectedImages(new Set());
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['image-stats'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleImageSelect = (imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  };

  const formatFileSize = (bytes: number | undefined | null) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    if (isNaN(bytes)) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Image Management</h2>
          <p className="text-gray-600">Upload, organize, and manage product images</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <CloudArrowUpIcon className="h-5 w-5 mr-2" />
          Upload Images
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard className="p-4">
            <div className="flex items-center">
              <PhotoIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">{images?.length || 0}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center">
              <DocumentIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSize || '0 B'}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center">
              <FolderIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Product Images</p>
                <p className="text-2xl font-bold text-gray-900">{images?.filter(img => img.entityType === 'product').length || 0}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center">
              <PhotoIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Other Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {images?.filter(img => img.entityType !== 'product').length || 0}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Advanced Filters and Search */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          {/* Primary Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by filename, tags, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Categories</option>
                <option value="product">Product Images</option>
                <option value="banner">Banner Images</option>
                <option value="brand">Brand Images</option>
                <option value="icon">Icon Images</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="uploadedAt">Upload Date</option>
                <option value="filename">Filename</option>
                <option value="size">File Size</option>
                <option value="entityType">Category</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-colors"
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
            
            {/* Bulk Actions */}
            {selectedImages.size > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => optimizeImagesMutation.mutate(Array.from(selectedImages))}
                  disabled={optimizeImagesMutation.isPending}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                >
                  Optimize ({selectedImages.size})
                </button>
                <button
                  onClick={() => bulkDeleteMutation.mutate(Array.from(selectedImages))}
                  disabled={bulkDeleteMutation.isPending}
                  className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                >
                  Delete ({selectedImages.size})
                </button>
              </div>
            )}
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/20">
            <select
              value={filterOptions.format}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, format: e.target.value }))}
              className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              <option value="all">All Formats</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="gif">GIF</option>
            </select>

            <select
              value={filterOptions.sizeRange}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, sizeRange: e.target.value }))}
              className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              <option value="all">All Sizes</option>
              <option value="small">Under 100KB</option>
              <option value="medium">100KB - 1MB</option>
              <option value="large">Over 1MB</option>
            </select>

            <select
              value={filterOptions.dateRange}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, dateRange: e.target.value }))}
              className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            <button
              onClick={() => setFilterOptions({ dateRange: 'all', sizeRange: 'all', format: 'all', quality: 'all' })}
              className="px-3 py-2 bg-gray-500/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-gray-500/30 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </GlassCard>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {images.length} images {selectedImages.size > 0 && `(${selectedImages.size} selected)`}
          </span>
          {images.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Images Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : images.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search criteria or filters'
              : 'Upload your first image to get started'}
          </p>
          <GlassButton onClick={() => setShowUploadModal(true)}>
            Upload Images
          </GlassButton>
        </GlassCard>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedImages.has(image.id) 
                  ? 'border-green-500 ring-2 ring-green-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleImageSelect(image.id)}
            >
              <div className="aspect-square relative">
                <img
                  src={`/api/image-management/serve/${image.filename}`}
                  alt={image.altText || image.description || image.originalName || 'Product image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image load error for:', image.filename);
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NS41IDU1LjVMMTE0LjUgOTQuNUgxNDQuNUw5NS41IDU1LjVaIiBmaWxsPSIjREREREREIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjEyIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(image);
                      }}
                      className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImageMutation.mutate(image.id);
                      }}
                      className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                
                {selectedImages.has(image.id) && (
                  <div className="absolute top-2 left-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate" title={image.originalName}>
                  {image.originalName}
                </p>
                <p className="text-xs text-gray-400">
                  {image.sizeBytes ? formatFileSize(image.sizeBytes) : '0 B'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {images.map((image) => (
            <div
              key={image.id}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedImages.has(image.id) 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleImageSelect(image.id)}
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={`/api/image-management/serve/${image.filename}`}
                  alt={image.altText || image.description || image.originalName || 'Product image'}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    console.error('Image load error for:', image.filename);
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNiAyNEwzOCAzNkg0Nkw0MiAyNFoiIGZpbGw9IiNEREREREQiLz4KPHR4dCB4PSIzMiIgeT0iNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iOCI+Tm8gaW1hZ2U8L3R4dD4KPC9zdmc+';
                  }}
                />
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-gray-900">{image.originalName}</h3>
                <p className="text-sm text-gray-500">
                  {image.entityType} • {image.sizeBytes ? formatFileSize(image.sizeBytes) : '0 B'} • {new Date(image.uploadedAt).toLocaleDateString()}
                </p>
                {image.description && (
                  <p className="text-sm text-gray-600 mt-1">{image.description}</p>
                )}
                {image.tags && image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {image.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const response = await fetch(`/api/image-management/images/${image.id}`);
                      if (response.ok) {
                        const imageData = await response.json();
                        setPreviewImage(imageData);
                      } else {
                        setPreviewImage(image);
                      }
                    } catch (error) {
                      setPreviewImage(image);
                    }
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteImageMutation.mutate(image.id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{previewImage.originalName}</h3>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="relative mb-4">
                <img
                  src={`/api/image-management/serve/${previewImage.filename}`}
                  alt={previewImage.altText || previewImage.description || previewImage.originalName || 'Product image'}
                  className="rounded-lg w-full h-auto max-h-[70vh] object-contain"
                  onError={(e: any) => {
                    console.error('Preview image load error for:', previewImage.filename);
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNDAgMjIwTDQ2MCAzODBINTgwTDM4MCAyMjBaIiBmaWxsPSIjREREREREIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNDgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjI0Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Type:</strong> {previewImage.entityType}</p>
                  <p><strong>Size:</strong> {formatFileSize(previewImage.sizeBytes)}</p>
                  <p><strong>Dimensions:</strong> {previewImage.width} × {previewImage.height}</p>
                </div>
                <div>
                  <p><strong>Format:</strong> {previewImage.mimeType}</p>
                  <p><strong>Uploaded:</strong> {new Date(previewImage.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {previewImage.description && (
                <div className="mt-4">
                  <p><strong>Description:</strong> {previewImage.description}</p>
                </div>
              )}
              
              {previewImage.tags && previewImage.tags.length > 0 && (
                <div className="mt-4">
                  <p><strong>Tags:</strong></p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewImage.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}