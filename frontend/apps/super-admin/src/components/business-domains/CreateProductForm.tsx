import React, { useState, useEffect } from 'react';
import { Package, Save, X } from 'lucide-react';
import ProductImageUpload from '../image-management/ProductImageUpload';

interface CreateProductFormProps {
  onClose: () => void;
  onProductCreated?: (product: any) => void;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Branch {
  id: string;
  name: string;
  location: string;
}

interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  branchId: string;
  price: string;
  costPrice: string;
  stockLevel: string;
  lowStockThreshold: string;
  sku: string;
  weight: string;
  unit: string;
  images: any[];
}

export default function CreateProductForm({ onClose, onProductCreated }: CreateProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    categoryId: '',
    branchId: '',
    price: '',
    costPrice: '',
    stockLevel: '',
    lowStockThreshold: '10',
    sku: '',
    weight: '',
    unit: 'kg',
    images: []
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
    fetchBranches();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/company-management/branches');
      const data = await response.json();
      if (data.success) {
        setBranches(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.branchId) newErrors.branchId = 'Branch is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) newErrors.costPrice = 'Valid cost price is required';
    if (!formData.stockLevel || parseInt(formData.stockLevel) < 0) newErrors.stockLevel = 'Valid stock level is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSKU = () => {
    const prefix = formData.name.slice(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    setFormData(prev => ({ ...prev, sku: `${prefix}-${timestamp}` }));
  };

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagesChange = (images: any[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create product using Product Orchestrator
      const productResponse = await fetch('/api/product-orchestrator/create-composite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          categoryId: formData.categoryId,
          branchId: formData.branchId,
          price: parseFloat(formData.price),
          costPrice: parseFloat(formData.costPrice),
          sku: formData.sku,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          unit: formData.unit,
          stockLevel: parseInt(formData.stockLevel),
          lowStockThreshold: parseInt(formData.lowStockThreshold),
          images: formData.images.map(img => img.id)
        }),
      });

      if (!productResponse.ok) {
        throw new Error('Failed to create product');
      }

      const productResult = await productResponse.json();
      
      if (onProductCreated) {
        onProductCreated(productResult.data);
      }
      
      onClose();
    } catch (error) {
      console.error('Product creation failed:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create New Product</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name in Telugu"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.sku ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Product SKU"
                />
                <button
                  type="button"
                  onClick={generateSKU}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Generate
                </button>
              </div>
              {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the organic product benefits and features"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Category and Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch *
              </label>
              <select
                value={formData.branchId}
                onChange={(e) => handleInputChange('branchId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.branchId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.location}
                  </option>
                ))}
              </select>
              {errors.branchId && <p className="text-red-500 text-xs mt-1">{errors.branchId}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.costPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.costPrice && <p className="text-red-500 text-xs mt-1">{errors.costPrice}</p>}
            </div>
          </div>

          {/* Weight and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight/Quantity
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="l">Liter (l)</option>
                <option value="ml">Milliliter (ml)</option>
                <option value="piece">Piece</option>
                <option value="dozen">Dozen</option>
              </select>
            </div>
          </div>

          {/* Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Stock Level *
              </label>
              <input
                type="number"
                value={formData.stockLevel}
                onChange={(e) => handleInputChange('stockLevel', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stockLevel ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stockLevel && <p className="text-red-500 text-xs mt-1">{errors.stockLevel}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>
          </div>

          {/* Product Images */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
            <ProductImageUpload
              entityType="products"
              onImagesChange={handleImagesChange}
              maxImages={5}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <Save className="h-4 w-4" />
              <span>{loading ? 'Creating...' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}