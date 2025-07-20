import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Package, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import CompositeProductForm from '../../modules/products/CompositeProductForm';

interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  originalPrice: number;
  isActive: boolean;
  isAvailable: boolean;
  images: any[];
  tags: any[];
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  branchSpecific: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
  stockLevel: number;
  lowStockThreshold: number;
}

export default function ProductCRUD() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [searchTerm, categoryFilter, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch products with retry logic
      const maxRetries = 5;
      let attempt = 0;
      let productsResponse;

      while (attempt < maxRetries) {
        try {
          productsResponse = await fetch('/api/products', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (productsResponse.ok) {
            break; // Success, exit retry loop
          } else if (productsResponse.status === 502) {
            // Service unavailable, wait and retry
            console.log(
              `Service unavailable, retrying in 3 seconds... (attempt ${attempt + 1}/${maxRetries})`
            );
            await new Promise(resolve => setTimeout(resolve, 3000));
            attempt++;
            continue;
          } else {
            // Other error, don't retry
            break;
          }
        } catch (error) {
          console.error(`Fetch attempt ${attempt + 1} failed:`, error);
          if (attempt === maxRetries - 1) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 3000));
          attempt++;
        }
      }

      if (productsResponse && productsResponse.ok) {
        const productsData = await productsResponse.json();
        console.log('Products data received:', productsData);
        // The API returns an array directly, not wrapped in data property
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else if (productsData && productsData.data && Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        } else {
          console.warn('Unexpected products data format:', productsData);
          setProducts([]);
        }
      } else {
        console.error('Failed to fetch products after retries');
        setProducts([]);
      }

      // Fetch categories with retry logic
      let categoriesResponse;
      attempt = 0;

      while (attempt < maxRetries) {
        try {
          categoriesResponse = await fetch('/api/categories', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (categoriesResponse.ok) {
            break; // Success, exit retry loop
          } else if (categoriesResponse.status === 502) {
            // Service unavailable, wait and retry
            console.log(
              `Categories service unavailable, retrying in 3 seconds... (attempt ${attempt + 1}/${maxRetries})`
            );
            await new Promise(resolve => setTimeout(resolve, 3000));
            attempt++;
            continue;
          } else {
            // Other error, don't retry
            break;
          }
        } catch (error) {
          console.error(`Categories fetch attempt ${attempt + 1} failed:`, error);
          if (attempt === maxRetries - 1) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 3000));
          attempt++;
        }
      }

      if (categoriesResponse && categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        console.log('Categories data received:', categoriesData);
        // Handle categories data format
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else if (categoriesData && categoriesData.data && Array.isArray(categoriesData.data)) {
          setCategories(categoriesData.data);
        } else {
          console.warn('Unexpected categories data format:', categoriesData);
          setCategories([]);
        }
      } else {
        console.error('Failed to fetch categories after retries');
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: ProductFormData) => {
    try {
      console.log('Creating product:', productData);

      const response = await fetch('/api/products/create-composite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          originalPrice: productData.price,
          sku: `SKU-${Date.now()}`,
          categoryId: productData.category || 1,
          isActive: productData.status === 'active',
          isAvailable: true,
          initialStock: productData.stockLevel || 0,
          lowStockThreshold: productData.lowStockThreshold || 10,
          branchSpecific: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const result = await response.json();
      console.log('Product created successfully:', result);

      await fetchData();
      setIsProductDialogOpen(false);
      // resetForm(); // Function not defined, remove call

      return result;
    } catch (error) {
      console.error('Failed to create product:', error);
      alert(
        'Failed to create product: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  const updateProduct = async (productId: number, productData: Partial<Product>) => {
    try {
      console.log('Updating product:', productId, productData);

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const result = await response.json();
      console.log('Product updated successfully:', result);

      await fetchData();
      setIsEditDialogOpen(false);
      setEditingProduct(null);

      return result;
    } catch (error) {
      console.error('Failed to update product:', error);
      alert(
        'Failed to update product: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
      }

      console.log('Deleting product:', productId);

      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      console.log('Product deleted successfully');
      await fetchData();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert(
        'Failed to delete product: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  const uploadProductImage = async (productId: number, file: File) => {
    try {
      console.log('Uploading image for product:', productId);

      const formData = new FormData();
      formData.append('files', file);
      formData.append('entityType', 'product');
      formData.append('entityId', productId.toString());

      const response = await fetch('/api/image-management/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      console.log('Image uploaded successfully');
      await fetchData();
    } catch (error) {
      console.error('Failed to upload product image:', error);
      alert(
        'Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || product.category.id.toString() === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && product.isActive) ||
      (statusFilter === 'inactive' && !product.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading Product Catalog...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        {/* Note: Product creation is handled through sidebar navigation to /create-product */}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-left py-3 px-4 font-medium">SKU</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Price</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {product.images.length > 0 && (
                          <img
                            src={product.images[0]?.url || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{product.sku}</code>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{product.category.name}</Badge>
                    </td>
                    <td className="py-3 px-4">₹{product.price}</td>
                    <td className="py-3 px-4">
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(product)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) uploadProductImage(product.id, file);
                          }}
                          className="hidden"
                          id={`image-${product.id}`}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => document.getElementById(`image-${product.id}`)?.click()}
                        >
                          Upload Image
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Dialog - Using Comprehensive CompositeProductForm */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
          <CompositeProductForm
            editMode={true}
            productId={editingProduct?.id?.toString()}
            initialData={editingProduct}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              setEditingProduct(null);
              fetchData(); // Refresh the product list
            }}
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
