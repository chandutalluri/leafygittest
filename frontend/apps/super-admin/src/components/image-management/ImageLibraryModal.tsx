import { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon, CheckIcon } from '@heroicons/react/24/outline';
// Removed Next.js Image import to use direct img tags for better compatibility
import { motion, AnimatePresence } from 'framer-motion';
import { ImageMetadata } from '../../stores/imageStore';

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImages: (images: ImageMetadata[]) => void;
  entityType?: string;
  maxSelection?: number;
}

export default function ImageLibraryModal({
  isOpen,
  onClose,
  onSelectImages,
  entityType = 'product',
  maxSelection = 5
}: ImageLibraryModalProps) {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/image-management?entityType=${entityType}`);
      if (response.ok) {
        const data = await response.json();
        const imageList = data.images || data || [];
        setImages(imageList.map((img: any) => ({
          ...img,
          variants: {
            thumbnail: `/api/image-management/variants/${img.filename}?variant=thumbnail`,
            small: `/api/image-management/variants/${img.filename}?variant=small`,
            medium: `/api/image-management/variants/${img.filename}?variant=medium`,
            large: `/api/image-management/variants/${img.filename}?variant=large`,
            original: `/api/image-management/serve/${img.filename}`
          }
        })));
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else if (newSelection.size < maxSelection) {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const handleSelectImages = () => {
    const selected = images.filter(img => selectedImages.has(img.id));
    onSelectImages(selected);
    onClose();
    setSelectedImages(new Set());
  };

  const filteredImages = images.filter(img =>
    img.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Image Library</h2>
            <p className="text-sm text-gray-600">
              Select up to {maxSelection} images ({selectedImages.size} selected)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Loading images...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No images found</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredImages.map((image) => {
                const isSelected = selectedImages.has(image.id);
                return (
                  <div
                    key={image.id}
                    onClick={() => toggleImageSelection(image.id)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={image.variants?.thumbnail || `/api/image-management/serve/${image.filename}`}
                        alt={image.originalName}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                      
                      {isSelected && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <div className="bg-green-500 rounded-full p-1">
                            <CheckIcon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate" title={image.originalName}>
                        {image.originalName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            {selectedImages.size} of {maxSelection} images selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectImages}
              disabled={selectedImages.size === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Select Images
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}