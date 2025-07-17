import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { PhotoIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface SimpleImage {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  url: string;
}

interface ImagePreviewModalProps {
  image: SimpleImage;
  isOpen: boolean;
  onClose: () => void;
}

function ImagePreviewModal({ image, isOpen, onClose }: ImagePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{image.originalName || image.filename}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="text-center">
          <img
            src={image.url}
            alt={image.originalName || image.filename}
            className="max-w-full max-h-96 object-contain mx-auto rounded-lg"
            onError={(e) => {
              console.error('Image failed to load:', image.url);
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEzMEg3MEwxMDAgNzBaIiBmaWxsPSIjOWNhM2FmIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjYwIiByPSIxMCIgZmlsbD0iIzljYTNhZiIvPgo8L3N2Zz4=';
            }}
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>File:</strong> {image.filename}</p>
          <p><strong>Size:</strong> {(image.size / 1024).toFixed(1)} KB</p>
          <p><strong>Uploaded:</strong> {new Date(image.uploadedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default function SimpleImageGrid() {
  const [selectedImage, setSelectedImage] = useState<SimpleImage | null>(null);
  const queryClient = useQueryClient();

  // Fetch images
  const { data: images = [], isLoading, error } = useQuery<SimpleImage[]>({
    queryKey: ['simple-images'],
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
  const { data: stats } = useQuery({
    queryKey: ['simple-image-stats'],
    queryFn: async () => {
      const response = await fetch('/api/image-management/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async (filename: string) => {
      const response = await fetch(`/api/image-management/images/${filename}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete image');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Image deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['simple-images'] });
      queryClient.invalidateQueries({ queryKey: ['simple-image-stats'] });
    },
    onError: (error: any) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading images: {(error as Error).message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center">
            <PhotoIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Images</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalImages || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xs font-bold">SIZE</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Size</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalSizeFormatted || '0 B'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xs font-bold">VAR</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Variants</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.variants || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xs font-bold">FMT</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Formats</p>
              <p className="text-sm font-semibold text-gray-900">JPEG, PNG, WebP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
          <p className="mt-1 text-sm text-gray-500">Upload your first image to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {images.map((image, index) => (
            <div key={`${image.filename}-${index}`} className="bg-white rounded-lg p-3 shadow-sm border group hover:shadow-md transition-shadow">
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={image.originalName || image.filename}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    console.error('Image failed to load:', image.url);
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEzMEg3MEwxMDAgNzBaIiBmaWxsPSIjOWNhM2FmIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjYwIiByPSIxMCIgZmlsbD0iIzljYTNhZiIvPgo8L3N2Zz4=';
                  }}
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                      title="Preview"
                    >
                      <EyeIcon className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(image.filename)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                      title="Delete"
                      disabled={deleteMutation.isPending}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {image.originalName || image.filename}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(image.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <ImagePreviewModal
        image={selectedImage!}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}