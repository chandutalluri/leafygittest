import { create } from 'zustand';

export interface ImageVariant {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  original: string;
}

export interface ImageMetadata {
  id: string;
  filename: string;
  originalName: string;
  entityType: string;
  entityId: string;
  description?: string;
  category?: string;
  isPublic: boolean;
  size: number;
  mimeType: string;
  uploadedAt: string;
  variants: ImageVariant;
  order?: number;
}

interface ImageState {
  images: ImageMetadata[];
  uploading: boolean;
  error: string | null;
  
  // Actions
  setImages: (images: ImageMetadata[]) => void;
  addImage: (image: ImageMetadata) => void;
  removeImage: (id: string) => void;
  updateImageOrder: (images: ImageMetadata[]) => void;
  setUploading: (uploading: boolean) => void;
  setError: (error: string | null) => void;
  clearImages: () => void;
  
  // API Actions
  uploadImages: (files: File[], entityType: string, entityId: string) => Promise<void>;
  fetchImages: (entityType: string, entityId: string) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
}

export const useImageStore = create<ImageState>((set, get) => ({
  images: [],
  uploading: false,
  error: null,

  setImages: (images) => set({ images }),
  addImage: (image) => set(state => ({ images: [...state.images, image] })),
  removeImage: (id) => set(state => ({ 
    images: state.images.filter(img => img.id !== id) 
  })),
  updateImageOrder: (images) => set({ images }),
  setUploading: (uploading) => set({ uploading }),
  setError: (error) => set({ error }),
  clearImages: () => set({ images: [], error: null }),

  uploadImages: async (files: File[], entityType: string, entityId: string) => {
    const { setUploading, setError, fetchImages } = get();
    
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('entityType', entityType);
      formData.append('entityId', entityId);
      
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/image-management/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      // Refresh images list
      await fetchImages(entityType, entityId);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      throw error;
    } finally {
      setUploading(false);
    }
  },

  fetchImages: async (entityType: string, entityId: string) => {
    const { setError } = get();
    
    try {
      setError(null);
      
      const response = await fetch(
        `/api/image-management/images?entityType=${entityType}&entityId=${entityId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const images = data.images || data || [];
      
      set({ images: images.map((img: any, index: number) => ({
        ...img,
        order: index,
        variants: {
          thumbnail: `/api/image-management/variants/${img.filename}?variant=thumbnail`,
          small: `/api/image-management/variants/${img.filename}?variant=small`,
          medium: `/api/image-management/variants/${img.filename}?variant=medium`,
          large: `/api/image-management/variants/${img.filename}?variant=large`,
          original: `/api/image-management/serve/${img.filename}`
        }
      })) });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch images');
    }
  },

  deleteImage: async (id: string) => {
    const { setError, removeImage } = get();
    
    try {
      setError(null);
      
      const response = await fetch(`/api/image-management/images/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      removeImage(id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete image');
      throw error;
    }
  },
}));