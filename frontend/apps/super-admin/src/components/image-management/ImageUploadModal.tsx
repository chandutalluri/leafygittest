import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadFile extends File {
  id: string;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export default function ImageUploadModal({ isOpen, onClose }: ImageUploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [entityType, setEntityType] = useState('product');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [altText, setAltText] = useState('');
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (uploadData: { files: File[], metadata: any }) => {
      console.log('Upload mutation called with files:', uploadData.files.length);
      
      // Upload files one by one for better error handling
      const results = [];
      for (const file of uploadData.files) {
        console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entityType', uploadData.metadata.entityType);
        formData.append('description', uploadData.metadata.description);
        formData.append('altText', uploadData.metadata.altText);
        formData.append('tags', uploadData.metadata.tags);

        const response = await fetch('/api/image-management/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Upload failed for file:', file.name, 'Error:', errorText);
          throw new Error(`Upload failed for ${file.name}: ${response.status}`);
        }

        const result = await response.json();
        console.log('Upload success for file:', file.name, result);
        results.push(result);
      }
      
      return results;
    },
    onSuccess: (data) => {
      const uploadedCount = Array.isArray(data) ? data.length : 1;
      toast.success(`Successfully uploaded ${uploadedCount} image${uploadedCount > 1 ? 's' : ''} with automatic variants`);
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['image-stats'] });
      setFiles([]);
      setDescription('');
      setTags('');
      setAltText('');
      handleClose();
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      // Create a proper UploadFile that extends File
      const uploadFile = file as UploadFile;
      uploadFile.id = Math.random().toString(36).substr(2, 9);
      uploadFile.preview = URL.createObjectURL(file);
      uploadFile.status = 'pending';
      uploadFile.progress = 0;
      return uploadFile;
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast.error('Please select at least one image to upload');
      return;
    }

    // Use the files directly as they are File objects with additional properties
    const actualFiles = files.filter(f => f instanceof File || (f as any).stream);

    console.log('Starting upload with files:', actualFiles.map(f => ({name: f.name, size: f.size, type: f.type})));

    const metadata = {
      entityType: entityType.toLowerCase().replace(' ', '-'),
      description,
      altText,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean).join(',')
    };

    console.log('Upload metadata:', metadata);
    uploadMutation.mutate({ files: actualFiles, metadata });
  };

  const handleClose = () => {
    // Clean up preview URLs
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setDescription('');
    setTags('');
    setAltText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Upload Images</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-green-600 font-medium">Drop the images here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 font-medium mb-2">
                    Drag & drop images here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPEG, PNG, WebP, GIF (max 10MB each)
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Type
                </label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="product">Product Image</option>
                  <option value="banner">Banner Image</option>
                  <option value="brand">Brand Image</option>
                  <option value="icon">Icon Image</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Image description for accessibility"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the images"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas (e.g., organic, fresh, vegetables)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Selected Images ({files.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                  {files.map((file) => (
                    <div key={file.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2">
                        <p className="text-xs truncate">{file.name}</p>
                        <p className="text-xs text-gray-300">
                          {file.size && !isNaN(file.size) ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : '0 MB'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <GlassButton
                onClick={handleClose}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </GlassButton>
              <GlassButton
                onClick={handleUpload}
                disabled={files.length === 0 || uploadMutation.isPending}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {uploadMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Uploading...
                  </div>
                ) : (
                  `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`
                )}
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}