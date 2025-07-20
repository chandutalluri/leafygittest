import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon, Upload, X, Eye, Smartphone, Monitor, Tablet } from 'lucide-react';

interface ProductImageUploadProps {
  productId?: string;
  entityType?: string;
  onImagesChange?: (images: UploadedImage[]) => void;
  maxImages?: number;
}

interface UploadedImage {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  variants: Record<string, string>;
  uploadedAt: string;
  entityType: string;
  entityId?: string;
}

interface ImageVariantPreview {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  size: string;
}

const IMAGE_VARIANTS: ImageVariantPreview[] = [
  { name: 'mobile-thumb', description: 'Mobile Thumbnail', icon: Smartphone, size: '120x120' },
  { name: 'mobile-card', description: 'Mobile Card', icon: Smartphone, size: '300x300' },
  { name: 'tablet-card', description: 'Tablet View', icon: Tablet, size: '400x400' },
  { name: 'desktop-grid', description: 'Desktop Grid', icon: Monitor, size: '250x250' },
  { name: 'desktop-detail', description: 'Desktop Detail', icon: Monitor, size: '800x800' },
  { name: 'thumbnail', description: 'Standard Thumbnail', icon: ImageIcon, size: '150x150' },
  { name: 'large', description: 'High Resolution', icon: ImageIcon, size: '1200x1200' },
];

export default function ProductImageUpload({
  productId,
  entityType = 'products',
  onImagesChange,
  maxImages = 5,
}: ProductImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('original');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadedImages.length + acceptedFiles.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        return;
      }

      setUploading(true);

      try {
        const uploadPromises = acceptedFiles.map(async file => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('entityType', entityType);
          if (productId) {
            formData.append('entityId', productId);
          }

          const response = await fetch('/api/image-management/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const result = await response.json();
          return result.data;
        });

        const newImages = await Promise.all(uploadPromises);
        const updatedImages = [...uploadedImages, ...newImages];
        setUploadedImages(updatedImages);

        if (onImagesChange) {
          onImagesChange(updatedImages);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [uploadedImages, maxImages, entityType, productId, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true,
    disabled: uploading || uploadedImages.length >= maxImages,
  });

  const removeImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/image-management/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedImages = uploadedImages.filter(img => img.id !== imageId);
        setUploadedImages(updatedImages);
        if (onImagesChange) {
          onImagesChange(updatedImages);
        }
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const getImageUrl = (image: UploadedImage, variant: string = 'original') => {
    if (variant === 'original') {
      return `/api/image-management/serve/${image.filename}`;
    }
    return `/api/image-management/serve/${image.variants[variant] || image.filename}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${
            uploading || uploadedImages.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? 'Drop images here...' : 'Drag & drop product images here'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to select files • Max {maxImages} images • JPEG, PNG, WebP
        </p>

        {uploading && (
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
            Processing images with optimization...
          </div>
        )}

        <p className="text-xs text-gray-400 mt-2">
          Industry-standard optimization: Mobile, Tablet, Desktop variants
        </p>
      </div>

      {/* Image Variants Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Automatic Image Optimization</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {IMAGE_VARIANTS.map(variant => {
            const IconComponent = variant.icon;
            return (
              <div key={variant.name} className="flex items-center space-x-2 text-sm">
                <IconComponent className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-700">{variant.description}</div>
                  <div className="text-gray-500">{variant.size}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Uploaded Images ({uploadedImages.length}/{maxImages})
            </h4>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Preview variant:</label>
              <select
                value={selectedVariant}
                onChange={e => setSelectedVariant(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="original">Original</option>
                {IMAGE_VARIANTS.map(variant => (
                  <option key={variant.name} value={variant.name}>
                    {variant.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map(image => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(image, selectedVariant)}
                    alt={image.originalName}
                    className="w-full h-full object-cover"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = getImageUrl(image, 'original');
                    }}
                  />
                </div>

                {/* Image Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                    <button
                      onClick={() => setPreviewImage(getImageUrl(image, selectedVariant))}
                      className="p-1 bg-white text-gray-700 rounded-full hover:bg-gray-100"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-1 bg-white text-red-600 rounded-full hover:bg-red-50"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="mt-2 text-xs text-gray-600">
                  <div className="font-medium truncate">{image.originalName}</div>
                  <div className="flex justify-between">
                    <span>{formatFileSize(image.size)}</span>
                    <span>{Object.keys(image.variants).length} variants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
