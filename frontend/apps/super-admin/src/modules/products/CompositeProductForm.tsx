'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ShoppingBagIcon,
  PhotoIcon,
  TagIcon,
  BuildingStorefrontIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import ImageSelector from '../../components/image-management/ImageSelector';
import { useAuthStore } from '../../stores/authStore';
import { useBranchStore } from '../../stores/branchStore';
import toast from 'react-hot-toast';

interface CompositeProductFormData {
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  weight?: number;
  unit?: string;
  categoryId: string;
  branchIds: string[];
  openingStock: number;
  reorderLevel: number;
  maxStock?: number;
  stockStatus?: string;
  isFeatured?: boolean;
  isDigital?: boolean;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  attributes?: any;
  dimensions?: any;
  imageFile?: FileList;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  location?: string;
}

interface CompositeProductFormProps {
  editMode?: boolean;
  productId?: string;
  initialData?: any;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function CompositeProductForm({
  editMode = false,
  productId,
  initialData,
  onClose,
  onSuccess,
}: CompositeProductFormProps) {
  const { user, token } = useAuthStore();
  const { branches } = useBranchStore();

  // Transform branches to match our interface
  const formattedBranches =
    branches?.map((branch: any) => ({
      ...branch,
      address: branch.address || branch.location || 'Location not specified',
    })) || [];
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CompositeProductFormData>({
    defaultValues:
      editMode && initialData
        ? {
            name: initialData.name || '',
            description: initialData.description || '',
            shortDescription: initialData.shortDescription || '',
            sku: initialData.sku || '',
            barcode: initialData.barcode || '',
            price: initialData.price || 0,
            salePrice: initialData.salePrice || 0,
            costPrice: initialData.costPrice || 0,
            weight: initialData.weight || 0,
            unit: initialData.unit || 'kg',
            categoryId: initialData.categoryId || initialData.category?.id || '',
            openingStock: initialData.openingStock || 0,
            reorderLevel: initialData.reorderLevel || 10,
            maxStock: initialData.maxStock || 1000,
            stockStatus: initialData.stockStatus || 'in_stock',
            isFeatured: initialData.isFeatured || false,
            isDigital: initialData.isDigital || false,
            status: initialData.status || 'active',
            seoTitle: initialData.seoTitle || '',
            seoDescription: initialData.seoDescription || '',
            tags: initialData.tags || [],
            attributes: initialData.attributes || {},
            dimensions: initialData.dimensions || {},
          }
        : {
            name: '',
            description: '',
            shortDescription: '',
            sku: '',
            barcode: '',
            price: 0,
            salePrice: 0,
            costPrice: 0,
            weight: 0,
            unit: 'kg',
            categoryId: '',
            openingStock: 0,
            reorderLevel: 0,
            maxStock: 1000,
            stockStatus: 'in_stock',
            isFeatured: false,
            isDigital: false,
            status: 'active',
            seoTitle: '',
            seoDescription: '',
            tags: [],
            attributes: {},
            dimensions: {},
          },
  });

  // Fetch categories with useEffect and useState
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from /api/categories');
        setCategoriesLoading(true);
        const response = await fetch('/api/categories');

        if (!response.ok) {
          console.error('Categories API failed:', response.status, response.statusText);
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const data = await response.json();
        console.log('Categories API response:', data);

        // The API returns {success: true, data: [...]} format
        if (data && data.success && Array.isArray(data.data)) {
          console.log('Categories found (success/data format):', data.data.length);
          setCategories(data.data);
        } else if (Array.isArray(data)) {
          console.log('Categories found (array format):', data.length);
          setCategories(data);
        } else {
          console.warn('Categories API returned unexpected format:', data);
          setCategories([]);
        }

        setCategoriesError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesError(error instanceof Error ? error.message : 'Failed to fetch categories');
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Debug logging
  console.log('Categories loading state:', {
    categories: categories?.length || 0,
    isLoading: categoriesLoading,
    error: categoriesError,
  });

  // Create or update composite product mutation
  const productMutation = useMutation({
    mutationFn: async (data: CompositeProductFormData) => {
      const productData = {
        name: data.name,
        description: data.description || '',
        shortDescription: data.shortDescription || '',
        sku: data.sku || '',
        barcode: data.barcode || '',
        price: Number(data.price) || 0,
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        costPrice: data.costPrice ? Number(data.costPrice) : null,
        weight: data.weight ? Number(data.weight) : null,
        unit: data.unit || 'kg',
        categoryId: parseInt(data.categoryId) || 1,
        branchIds: selectedBranches.map(id => parseInt(id)),
        openingStock: Number(data.openingStock) || 100,
        reorderLevel: Number(data.reorderLevel) || 10,
        maxStock: data.maxStock ? Number(data.maxStock) : null,
        stockStatus: data.stockStatus || 'in_stock',
        isFeatured: data.isFeatured || false,
        isDigital: data.isDigital || false,
        status: data.status || 'active',
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        tags: data.tags || [],
        attributes: data.attributes || {},
        dimensions: data.dimensions || {},
      };

      const apiUrl = editMode
        ? `/api/products/${productId}`
        : '/api/product-orchestrator/create-composite';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${editMode ? 'update' : 'create'} product`);
      }

      return response.json();
    },
    onSuccess: data => {
      toast.success(`Product ${editMode ? 'updated' : 'created'} successfully!`);
      setCreatedProductId(data.productId || data.id);

      if (editMode) {
        // Call onSuccess callback and close modal for edit mode
        onSuccess?.();
        onClose?.();
      } else {
        // Reset form for create mode
        reset();
        setSelectedBranches([]);
        setSelectedImages([]);
      }
    },
    onError: (error: any) => {
      console.error(`Product ${editMode ? 'update' : 'creation'} error:`, {
        message: error?.message || 'Unknown error',
        status: error?.status,
        response: error?.response,
        stack: error?.stack,
      });
      toast.error(error?.message || `Failed to ${editMode ? 'update' : 'create'} product`);
    },
  });

  const onSubmit = async (data: CompositeProductFormData) => {
    if (selectedBranches.length === 0) {
      toast.error('Please select at least one branch');
      return;
    }

    if (!data.categoryId) {
      toast.error('Please select a category');
      return;
    }

    productMutation.mutate(data);
  };

  // Initialize with available branches
  useEffect(() => {
    if (formattedBranches && formattedBranches.length > 0 && selectedBranches.length === 0) {
      setSelectedBranches([formattedBranches[0].id]);
    }
  }, [formattedBranches, selectedBranches.length]);

  const handleBranchToggle = (branchId: string) => {
    setSelectedBranches(prev =>
      prev.includes(branchId) ? prev.filter(id => id !== branchId) : [...prev, branchId]
    );
  };

  const handleImageSelection = (images: any[]) => {
    setSelectedImages(images);
  };

  const generateProductLabel = async () => {
    if (!createdProductId) {
      toast.error('Please create a product first');
      return;
    }

    setIsGeneratingLabel(true);
    try {
      const response = await fetch('/api/label-design/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: createdProductId,
          templateType: 'standard',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate label');
      }

      const labelData = await response.json();
      toast.success('Product label generated successfully!');

      // Download the label
      if (labelData.downloadUrl) {
        window.open(labelData.downloadUrl, '_blank');
      }
    } catch (error) {
      toast.error('Failed to generate product label');
    } finally {
      setIsGeneratingLabel(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <LoadingSkeleton className="h-8 w-64 mb-4" />
          <LoadingSkeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
          <div className="flex items-center">
            <ShoppingBagIcon className="h-10 w-10 text-white mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {editMode ? 'Edit Product' : 'Create New Product'}
              </h1>
              <p className="text-green-100 mt-1">
                {editMode
                  ? 'Update product information across all branches'
                  : 'Add products to your inventory across multiple branches'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Product Images Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <PhotoIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Select images from your central image library
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowImageSelector(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {selectedImages.length > 0 ? 'Change Images' : 'Select Images'}
                  </button>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={`selected-image-${image.id}`} className="relative group">
                        <img
                          src={image.url}
                          alt={image.originalName || image.filename}
                          className="w-full h-24 object-cover rounded-lg border-2 border-blue-500"
                        />
                        <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedImages(prev => prev.filter(img => img.id !== image.id))
                          }
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedImages.length === 0 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-700">No images selected</p>
                    <p className="text-xs text-gray-500">
                      Click "Select Images" to choose from your image library
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Product name is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    SKU (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('sku')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Barcode (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('barcode')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Product barcode"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Short Description
                  </label>
                  <textarea
                    {...register('shortDescription')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 resize-none"
                    placeholder="Brief product summary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 resize-none"
                    placeholder="Detailed product description"
                  />
                </div>
              </div>
            </div>

            {/* Category and Pricing Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <TagIcon className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Category & Pricing</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Category *</label>
                  <select
                    {...register('categoryId', { required: 'Category is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category: any) => (
                      <option key={`category-${category.id}`} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', {
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('salePrice', {
                      min: { value: 0, message: 'Sale price must be positive' },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                  />
                  {errors.salePrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.salePrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('costPrice', {
                      min: { value: 0, message: 'Cost price must be positive' },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                  />
                  {errors.costPrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.costPrice.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('discount')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('taxRate')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Available Branches Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <BuildingStorefrontIcon className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Available Branches</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formattedBranches?.map(branch => (
                  <div key={`branch-${branch.id}`} className="relative">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(branch.id)}
                        onChange={() => handleBranchToggle(branch.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{branch.name}</p>
                        <p className="text-xs text-gray-500">{branch.address}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {selectedBranches.length === 0 && (
                <p className="mt-2 text-sm text-red-600">Please select at least one branch</p>
              )}
            </div>

            {/* Inventory Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <CurrencyRupeeIcon className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Inventory Settings</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Opening Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('openingStock', {
                      min: { value: 0, message: 'Opening stock must be non-negative' },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="0"
                  />
                  {errors.openingStock && (
                    <p className="mt-1 text-sm text-red-600">{errors.openingStock.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Reorder Level
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('reorderLevel', {
                      min: { value: 0, message: 'Reorder level must be non-negative' },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="0"
                  />
                  {errors.reorderLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.reorderLevel.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Maximum Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('maxStock', {
                      min: { value: 0, message: 'Maximum stock must be non-negative' },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="1000"
                  />
                  {errors.maxStock && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxStock.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Physical Attributes Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <BuildingStorefrontIcon className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Physical Attributes</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Weight</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('weight', {
                      min: { value: 0, message: 'Weight must be positive' },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Unit</label>
                  <select
                    {...register('unit')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="l">Liter (l)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="piece">Piece</option>
                    <option value="dozen">Dozen</option>
                    <option value="pack">Pack</option>
                    <option value="box">Box</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Stock Status
                  </label>
                  <select
                    {...register('stockStatus')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="limited_stock">Limited Stock</option>
                    <option value="pre_order">Pre-Order</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isFeatured')}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">Featured Product</span>
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isDigital')}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">Digital Product</span>
                  </label>
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <TagIcon className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">SEO & Meta Information</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">SEO Title</label>
                  <input
                    type="text"
                    {...register('seoTitle')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="SEO optimized product title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    {...register('seoDescription')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 resize-none"
                    placeholder="SEO meta description for search engines"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {editMode ? 'Updating Product...' : 'Creating Product...'}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-2" />
                    {editMode ? 'Update Product' : 'Create Product'}
                  </div>
                )}
              </button>

              {createdProductId && (
                <button
                  type="button"
                  onClick={generateProductLabel}
                  disabled={isGeneratingLabel}
                  className="px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingLabel ? 'Generating...' : 'Generate Label'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Image Selector Modal */}
      {showImageSelector && (
        <ImageSelector
          isOpen={showImageSelector}
          onSelect={handleImageSelection}
          onClose={() => setShowImageSelector(false)}
          selectedImages={selectedImages}
        />
      )}
    </div>
  );
}
