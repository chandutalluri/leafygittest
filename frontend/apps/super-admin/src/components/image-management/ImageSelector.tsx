import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PhotoIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SimpleImage {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  url: string;
}

interface ImageSelectorProps {
  onSelect: (images: SimpleImage[]) => void;
  selectedImages: SimpleImage[];
  maxImages?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageSelector({
  onSelect,
  selectedImages,
  maxImages = 5,
  isOpen,
  onClose,
}: ImageSelectorProps) {
  const [localSelectedImages, setLocalSelectedImages] = useState<SimpleImage[]>(selectedImages);

  // Fetch available images
  const { data: images = [], isLoading } = useQuery<SimpleImage[]>({
    queryKey: ['available-images'],
    queryFn: async () => {
      const response = await fetch('/api/image-management/images');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();

      // Transform the data to include proper URLs
      const imageList = data.data || data.images || [];
      return imageList.map((img: any) => ({
        ...img,
        url: `/api/image-management/serve/${img.filename}`,
      }));
    },
    enabled: isOpen,
  });

  const toggleImageSelection = (image: SimpleImage) => {
    const isSelected = localSelectedImages.some(img => img.id === image.id);

    if (isSelected) {
      setLocalSelectedImages(prev => prev.filter(img => img.id !== image.id));
    } else if (localSelectedImages.length < maxImages) {
      setLocalSelectedImages(prev => [...prev, image]);
    }
  };

  const handleConfirm = () => {
    onSelect(localSelectedImages);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedImages(selectedImages);
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-auto m-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select Product Images</h3>
            <p className="text-sm text-gray-500">
              Choose up to {maxImages} images from your central image library
            </p>
          </div>
          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Selection Summary */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {localSelectedImages.length} of {maxImages} images selected
            </span>
            {localSelectedImages.length > 0 && (
              <button
                onClick={() => setLocalSelectedImages([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading images...</div>
          </div>
        )}

        {/* No Images State */}
        {!isLoading && images.length === 0 && (
          <div className="text-center py-12">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload images in the Image Management tab first
            </p>
          </div>
        )}

        {/* Image Grid */}
        {!isLoading && images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {images.map((image, index) => {
              const isSelected = localSelectedImages.some(img => img.id === image.id);
              const canSelect = localSelectedImages.length < maxImages || isSelected;

              return (
                <div
                  key={`${image.id}-${image.filename}-${index}`}
                  className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : canSelect
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => canSelect && toggleImageSelection(image)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.originalName || image.filename}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEzMEg3MEwxMDAgNzBaIiBmaWxsPSIjOWNhM2FmIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjYwIiByPSIxMCIgZmlsbD0iIzljYTNhZiIvPgo8L3N2Zz4=';
                      }}
                    />

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircleIcon className="h-6 w-6 text-blue-600 bg-white rounded-full" />
                      </div>
                    )}

                    {/* Selection Number */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                        {localSelectedImages.findIndex(img => img.id === image.id) + 1}
                      </div>
                    )}
                  </div>

                  {/* Image Info */}
                  <div className="p-2 bg-white">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {image.originalName || image.filename}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Images Preview */}
        {localSelectedImages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Images:</h4>
            <div className="flex flex-wrap gap-2">
              {localSelectedImages.map((image, index) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt={image.originalName || image.filename}
                    className="w-16 h-16 object-cover rounded border-2 border-blue-500"
                  />
                  <div className="absolute -top-1 -left-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <button
                    onClick={() => toggleImageSelection(image)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={localSelectedImages.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Select {localSelectedImages.length} Image{localSelectedImages.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
