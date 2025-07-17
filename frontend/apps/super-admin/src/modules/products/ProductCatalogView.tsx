/**
 * Product Catalog Management Component
 * Complete product lifecycle viewing and management
 */

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { 
  MagnifyingGlassIcon as SearchIcon, 
  FunnelIcon as FilterIcon, 
  PencilIcon as EditIcon, 
  TrashIcon, 
  EyeIcon,
  PlusIcon,
  CubeIcon as PackageIcon,
  TagIcon,
  CurrencyDollarIcon as DollarSignIcon
} from '@heroicons/react/24/outline';
import { Package, X, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface Product {
  id: number;
  name: string;
  price: number;
  category_name?: string;
  current_stock?: number;
  is_active: boolean;
  created_at: string;
  images?: { url: string }[];
}

interface ProductCatalogViewProps {
  onCreateProduct: () => void;
}

export function ProductCatalogView({ onCreateProduct }: ProductCatalogViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);
  
  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: 0,
    description: '',
    categoryId: 1,
    isActive: true
  });

  const { token } = useAuthStore();

  // Button handlers with real functionality
  const handleEditProduct = async (product: Product) => {
    console.log('Edit product:', product);
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price,
      description: '',
      categoryId: 1,
      isActive: product.is_active
    });
    setIsEditDialogOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    console.log('View product:', product);
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleAddToInventory = async (product: Product) => {
    console.log('Add to inventory:', product);
    try {
      // Toggle product status
      const response = await fetch(`/api/products/${product.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !product.is_active
        }),
      });

      if (response.ok) {
        await fetchProducts(); // Refresh the products list
        alert(`Product ${!product.is_active ? 'activated' : 'deactivated'} successfully!`);
      } else {
        alert('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Error updating product status');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;
    
    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editFormData.name,
          price: editFormData.price,
          isActive: editFormData.isActive,
        }),
      });

      if (response.ok) {
        await fetchProducts(); // Refresh the products list
        setIsEditDialogOpen(false);
        alert('Product updated successfully!');
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Products data received:', data);
        setProducts(data.data || data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product =>
        statusFilter === 'active' ? product.is_active : !product.is_active
      );
    }

    setFilteredProducts(filtered);
  };

  const handleStatusToggle = async (productId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        setProducts(prev =>
          prev.map(product =>
            product.id === productId
              ? { ...product, is_active: !currentStatus }
              : product
          )
        );
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <PackageIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
            <p className="text-sm text-gray-600">Manage your product inventory</p>
          </div>
        </div>
        <button
          onClick={onCreateProduct}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl rounded-lg border">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <div key={`product-${product.id}-${index}`} className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg border">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">ID: {product.id}</p>
                </div>
                <span 
                  className={`px-2 py-1 text-xs rounded-full ${product.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSignIcon className="h-4 w-4 mr-1" />
                    <span className="font-medium">₹{product.price}</span>
                  </div>
                  {product.current_stock !== undefined && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PackageIcon className="h-4 w-4 mr-1" />
                      <span>{product.current_stock}</span>
                    </div>
                  )}
                </div>

                {product.category_name && (
                  <div className="flex items-center text-sm text-gray-600">
                    <TagIcon className="h-4 w-4 mr-1" />
                    <span>{product.category_name}</span>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <button 
                    className="flex-1 px-3 py-2 text-sm bg-green-600 text-white border border-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    onClick={() => handleViewProduct(product)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button 
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    onClick={() => handleEditProduct(product)}
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button 
                    className={`flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center ${
                      product.is_active 
                        ? "bg-red-600 text-white hover:bg-red-700" 
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    onClick={() => handleAddToInventory(product)}
                  >
                    {product.is_active ? <TrashIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first product.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button 
                onClick={onCreateProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Product</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Product Details</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">View complete product information</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product Name</Label>
                  <div className="text-lg font-medium">{selectedProduct.name}</div>
                </div>
                <div>
                  <Label>Product ID</Label>
                  <div className="text-lg">{selectedProduct.id}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <div className="text-lg font-medium">₹{selectedProduct.price}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedProduct.is_active ? 'default' : 'secondary'}>
                    {selectedProduct.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <div className="text-lg">{selectedProduct.category_name || 'Not specified'}</div>
              </div>

              <div>
                <Label>Current Stock</Label>
                <div className="text-lg">{selectedProduct.current_stock || 'Not tracked'}</div>
              </div>

              <div>
                <Label>Created Date</Label>
                <div className="text-lg">{new Date(selectedProduct.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl bg-white border border-gray-200 shadow-xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Edit Product
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">Update product information</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 p-6 bg-white">
            {/* Product Image Section */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <Label className="text-lg font-semibold text-gray-900 mb-3 block">Product Image</Label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                  <div className="text-gray-400 text-center">
                    <PackageIcon className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-xs">No Image</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && selectedProduct) {
                        // Handle image upload here
                        console.log('Image selected:', file);
                      }
                    }}
                    className="hidden"
                    id={`edit-image-${selectedProduct?.id}`}
                  />
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => document.getElementById(`edit-image-${selectedProduct?.id}`)?.click()}
                  >
                    Choose Image
                  </Button>
                  <p className="text-sm text-gray-500">Upload JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-name" className="text-sm font-medium text-gray-900 mb-2 block">
                  Product Name *
                </Label>
                <Input
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="edit-price" className="text-sm font-medium text-gray-900 mb-2 block">
                  Price (₹) *
                </Label>
                <Input
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) || 0 })}
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium text-gray-900 mb-2 block">
                Description
              </Label>
              <Textarea
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-category" className="text-sm font-medium text-gray-900 mb-2 block">
                  Category *
                </Label>
                <Select 
                  value={editFormData.categoryId?.toString()}
                  onValueChange={(value) => setEditFormData({ ...editFormData, categoryId: parseInt(value) })}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id.toString()}
                        className="text-gray-900 hover:bg-gray-100"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status" className="text-sm font-medium text-gray-900 mb-2 block">
                  Status
                </Label>
                <Select 
                  value={editFormData.isActive ? 'active' : 'inactive'}
                  onValueChange={(value) => setEditFormData({ ...editFormData, isActive: value === 'active' })}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="active" className="text-gray-900 hover:bg-gray-100">Active</SelectItem>
                    <SelectItem value="inactive" className="text-gray-900 hover:bg-gray-100">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}