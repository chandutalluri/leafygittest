import React, { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  PhotoIcon, 
  TrashIcon, 
  EyeIcon, 
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  FolderIcon,
  TagIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedImage {
  id: number;
  filename: string;
  originalFilename: string;
  path: string;
  sizeBytes: number;
  mimeType: string;
  width?: number;
  height?: number;
  altText?: string;
  description?: string;
  tags?: string[];
  entityType?: string;
  entityId?: number;
  uploadedBy?: number;
  createdAt: string;
  updatedAt?: string;
}

interface ImageStats {
  total: number;
  totalSize: number;
  formattedTotalSize: string;
  byCategory: Record<string, number>;
  byEntityType: Record<string, number>;
  recent: AdvancedImage[];
}

interface ImageUploadProps {
  onUploadSuccess: () => void;
}

function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/image-management/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Image uploaded successfully!');
      onUploadSuccess();
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));
        formData.append('description', `Uploaded image: ${file.name}`);
        formData.append('entityType', 'product');
        
        setIsUploading(true);
        uploadMutation.mutate(formData, {
          onSettled: () => setIsUploading(false),
        });
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  return (
    <div className="mb-6">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drop images here or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            browse to upload
          </button>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports JPG, PNG, GIF, WebP up to 10MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      {isUploading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ImagePreviewModal({ 
  image, 
  isOpen, 
  onClose 
}: { 
  image: AdvancedImage | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen || !image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {image.originalFilename}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {image.description || 'No description'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <img
                src={image.path}
                alt={image.altText || image.filename}
                className="w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '60vh', objectFit: 'contain' }}
              />
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">File Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">File:</span>
                    <span className="font-medium">{image.filename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">
                      {(image.sizeBytes / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{image.mimeType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">
                      {image.width} × {image.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uploaded:</span>
                    <span className="font-medium">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {image.tags && image.tags.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {image.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Usage</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entity:</span>
                    <span className="font-medium">{image.entityType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entity ID:</span>
                    <span className="font-medium">{image.entityId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ImageGrid({ images, onImageClick }: { 
  images: AdvancedImage[]; 
  onImageClick: (image: AdvancedImage) => void; 
}) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (imageId: number) => {
      const response = await fetch(`/api/image-management/images/${imageId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Image deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['advanced-images'] });
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-square bg-gray-100 relative group">
            <img
              src={image.path}
              alt={image.altText || image.filename}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEzMEg3MEwxMDAgNzBaIiBmaWxsPSIjOWNhM2FmIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjYwIiByPSIxMCIgZmlsbD0iIzljYTNhZiIvPgo8L3N2Zz4=';
              }}
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => onImageClick(image)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="View details"
                >
                  <EyeIcon className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(image.id)}
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  title="Delete image"
                >
                  <TrashIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-3">
            <h4 className="font-medium text-gray-900 text-sm truncate">
              {image.originalFilename}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {(image.sizeBytes / 1024).toFixed(1)} KB • {image.mimeType.split('/')[1].toUpperCase()}
            </p>
            {image.tags && image.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {image.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {image.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{image.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function AdvancedImageManagement() {
  const [selectedImage, setSelectedImage] = useState<AdvancedImage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const queryClient = useQueryClient();

  // Fetch images
  const { data: images = [], isLoading, error } = useQuery<AdvancedImage[]>({
    queryKey: ['advanced-images'],
    queryFn: async () => {
      const response = await fetch('/api/image-management/images');
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.status}`);
      }
      const data = await response.json();
      return data.images || [];
    },
  });

  // Fetch stats
  const { data: stats } = useQuery<ImageStats>({
    queryKey: ['image-stats'],
    queryFn: async () => {
      const response = await fetch('/api/image-management/stats');
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      return response.json();
    },
  });

  // Filter images
  const filteredImages = images.filter(image => {
    const matchesSearch = image.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.altText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || image.entityType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['advanced-images'] });
    queryClient.invalidateQueries({ queryKey: ['image-stats'] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading images...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <InformationCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600">Error loading images: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <PhotoIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <FolderIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">{stats.formattedTotalSize}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <TagIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(stats.byCategory).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <DocumentDuplicateIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Entity Types</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(stats.byEntityType).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Images</h3>
        <ImageUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="product">Products</option>
            <option value="category">Categories</option>
            <option value="banner">Banners</option>
            <option value="logo">Logos</option>
          </select>
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Images ({filteredImages.length})
          </h3>
        </div>
        
        {filteredImages.length === 0 ? (
          <div className="text-center py-8">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No images found</p>
          </div>
        ) : (
          <ImageGrid images={filteredImages} onImageClick={setSelectedImage} />
        )}
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}