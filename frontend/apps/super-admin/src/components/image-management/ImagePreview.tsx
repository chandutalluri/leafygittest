import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface ImagePreviewProps {
  image: any;
  onImageUpdate: (updatedImage: any) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onImageUpdate }) => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedFormat, setSelectedFormat] = useState('webp');
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const sizes = [
    { key: 'thumbnail', label: 'Thumbnail (150x150)', dimensions: '150x150' },
    { key: 'small', label: 'Small (300x300)', dimensions: '300x300' },
    { key: 'medium', label: 'Medium (600x600)', dimensions: '600x600' },
    { key: 'large', label: 'Large (1200x1200)', dimensions: '1200x1200' },
    { key: 'xl', label: 'Extra Large (1920x1920)', dimensions: '1920x1920' },
    { key: 'original', label: 'Original', dimensions: 'Original' },
  ];

  const formats = [
    { key: 'webp', label: 'WebP (Best compression)' },
    { key: 'jpeg', label: 'JPEG' },
    { key: 'png', label: 'PNG' },
  ];

  useEffect(() => {
    loadMetadata();
  }, [image]);

  const loadMetadata = async () => {
    if (!image?.filename) return;

    setIsLoadingMetadata(true);
    try {
      const response = await fetch(`/api/image-management/metadata/${image.filename}`);
      if (response.ok) {
        const data = await response.json();
        setMetadata(data);
      }
    } catch (error) {
      console.error('Failed to load metadata:', error);
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const getImageUrl = () => {
    if (!image?.filename) return '/placeholder-image.jpg';

    let url = `/api/image-management/serve/${image.filename}`;
    const params = new URLSearchParams();

    if (selectedSize !== 'original') {
      params.append('size', selectedSize);
    }

    if (selectedFormat !== 'original') {
      params.append('format', selectedFormat);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return url;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = getImageUrl();
    link.download = `${image.original_name || image.filename}-${selectedSize}.${selectedFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/image-management/images/${image.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete image');

      toast.success('Image deleted successfully');
      onImageUpdate(null);
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image */}
          <div className="flex-1">
            <div className="aspect-square bg-black/20 rounded-lg overflow-hidden">
              <img
                src={getImageUrl()}
                alt={image.alt_text || image.original_name}
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {image.original_name || image.filename}
              </h3>
              <p className="text-white/60 text-sm">
                {image.description || 'No description provided'}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Image Size</label>
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                {sizes.map(size => (
                  <option key={size.key} value={size.key}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Output Format</label>
              <select
                value={selectedFormat}
                onChange={e => setSelectedFormat(e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                {formats.map(format => (
                  <option key={format.key} value={format.key}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Download
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metadata */}
      {metadata && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4">📊 Image Metadata</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-sm">File Size</div>
              <div className="text-white font-semibold">
                {metadata.size ? `${(metadata.size / 1024).toFixed(1)} KB` : 'N/A'}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-sm">Dimensions</div>
              <div className="text-white font-semibold">
                {metadata.width}x{metadata.height}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-sm">Format</div>
              <div className="text-white font-semibold">{metadata.format?.toUpperCase()}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-sm">Aspect Ratio</div>
              <div className="text-white font-semibold">{metadata.aspectRatio}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-sm">Channels</div>
              <div className="text-white font-semibold">{metadata.channels}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-sm">Has Alpha</div>
              <div className="text-white font-semibold">{metadata.hasAlpha ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImagePreview;
