import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Package,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Save,
  Plus,
  Minus,
  BarChart3,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface InventoryItem {
  productId: number;
  productName: string;
  sku: string;
  unitPrice: string;
  costPrice: string;
  categoryName: string | null;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  lastUpdated: string;
  stockValue: string;
  branchName: string;
  branchId: number;
  stockStatus: 'normal' | 'low' | 'critical' | 'out_of_stock';
}

interface Branch {
  id: number;
  name: string;
  location: string;
}

interface InventorySummary {
  total_skus: string;
  total_units: string;
  low_stock_count: string;
  critical_stock_count: string;
  out_of_stock_count: string;
  total_value: string;
}

export default function InventoryCRUD() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState({
    productId: 0,
    adjustmentType: 'increase' as 'increase' | 'decrease',
    quantity: 0,
    reason: '',
    newStock: 0,
  });

  useEffect(() => {
    fetchInventoryData();
  }, [searchTerm, branchFilter, statusFilter, categoryFilter]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);

      const [inventoryResponse, branchesResponse, summaryResponse] = await Promise.all([
        fetch('/api/inventory', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/branches', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/inventory/summary', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json();
        console.log('Inventory data received:', inventoryData);
        setInventory(inventoryData.data || inventoryData || []);
      }

      if (branchesResponse.ok) {
        const branchesData = await branchesResponse.json();
        console.log('Branches data received:', branchesData);
        setBranches(branchesData.data || branchesData || []);
      }

      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        console.log('Summary API Response:', summaryData);
        setSummary(summaryData.data || null);
      }
    } catch (error) {
      console.error('Failed to fetch inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (productId: number, newStock: number, reason?: string) => {
    try {
      console.log('Updating inventory for product:', productId, 'new stock:', newStock);

      const response = await fetch(`/api/inventory/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          stockLevel: newStock,
          reason: reason || 'Manual adjustment',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update inventory');
      }

      console.log('Inventory updated successfully');
      await fetchInventoryData();
      return true;
    } catch (error) {
      console.error('Failed to update inventory:', error);
      alert(
        'Failed to update inventory: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
      return false;
    }
  };

  const updateStockSettings = async (productId: number, reorderLevel: number, maxStock: number) => {
    try {
      console.log('Updating stock settings for product:', productId);

      const response = await fetch(`/api/inventory/${productId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reorderLevel, maxStock }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update stock settings');
      }

      console.log('Stock settings updated successfully');
      await fetchInventoryData();
      setIsEditDialogOpen(false);
      setEditingItem(null);
      return true;
    } catch (error) {
      console.error('Failed to update stock settings:', error);
      alert(
        'Failed to update settings: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
      return false;
    }
  };

  const makeStockAdjustment = async () => {
    try {
      const newStock =
        adjustmentData.adjustmentType === 'increase'
          ? adjustmentData.newStock + adjustmentData.quantity
          : adjustmentData.newStock - adjustmentData.quantity;

      if (newStock < 0) {
        alert('Stock cannot be negative');
        return;
      }

      const success = await updateInventory(
        adjustmentData.productId,
        newStock,
        `${adjustmentData.adjustmentType.toUpperCase()}: ${adjustmentData.quantity} units - ${adjustmentData.reason}`
      );

      if (success) {
        setIsAdjustDialogOpen(false);
        setAdjustmentData({
          productId: 0,
          adjustmentType: 'increase',
          quantity: 0,
          reason: '',
          newStock: 0,
        });
      }
    } catch (error) {
      console.error('Failed to make stock adjustment:', error);
      alert(
        'Failed to adjust stock: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  const deleteProduct = async (productId: number, productName: string) => {
    try {
      if (
        !confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)
      ) {
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
      await fetchInventoryData();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert(
        'Failed to delete product: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'default';
      case 'low':
        return 'secondary';
      case 'critical':
        return 'destructive';
      case 'out_of_stock':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const openAdjustmentDialog = (item: InventoryItem) => {
    setAdjustmentData({
      productId: item.productId,
      adjustmentType: 'increase',
      quantity: 0,
      reason: '',
      newStock: item.currentStock,
    });
    setIsAdjustDialogOpen(true);
  };

  // Get unique categories for filter dropdown
  const availableCategories = Array.from(
    new Set(inventory.map(item => item.categoryName).filter(Boolean))
  );

  const filteredInventory = inventory.filter(item => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'all' || item.branchId.toString() === branchFilter;
    const matchesCategory = categoryFilter === 'all' || item.categoryName === categoryFilter;

    // Determine stock status based on current stock and reorder level
    let currentStatus = 'normal';
    if (item.currentStock === 0) {
      currentStatus = 'out_of_stock';
    } else if (item.currentStock <= item.reorderLevel * 0.5) {
      currentStatus = 'critical';
    } else if (item.currentStock <= item.reorderLevel) {
      currentStatus = 'low';
    }

    const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;

    return matchesSearch && matchesBranch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">Loading Inventory Management...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management Center</h1>
          <p className="text-gray-500">Real-time inventory tracking for trading operations</p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summary.total_skus}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.total_units}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{summary.low_stock_count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.critical_stock_count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.out_of_stock_count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₹{summary.total_value}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Search className="h-5 w-5 text-blue-600" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Search Products
              </Label>
              <Input
                placeholder="Search products or SKU..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Branch Filter */}
            <div className="space-y-2">
              <Label htmlFor="branch" className="text-sm font-medium text-gray-700">
                Branch
              </Label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white border border-gray-200 shadow-lg"
                  style={{ zIndex: 9999 }}
                >
                  <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">
                    All Branches
                  </SelectItem>
                  {branches.map(branch => (
                    <SelectItem
                      key={branch.id}
                      value={branch.id.toString()}
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white border border-gray-200 shadow-lg"
                  style={{ zIndex: 9999 }}
                >
                  <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">
                    All Categories
                  </SelectItem>
                  {availableCategories.map(category => (
                    <SelectItem
                      key={category}
                      value={category!}
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Stock Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white border border-gray-200 shadow-lg"
                  style={{ zIndex: 9999 }}
                >
                  <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">
                    All Status
                  </SelectItem>
                  <SelectItem value="normal" className="text-gray-900 hover:bg-gray-100">
                    Normal Stock
                  </SelectItem>
                  <SelectItem value="low" className="text-gray-900 hover:bg-gray-100">
                    Low Stock
                  </SelectItem>
                  <SelectItem value="critical" className="text-gray-900 hover:bg-gray-100">
                    Critical Stock
                  </SelectItem>
                  <SelectItem value="out_of_stock" className="text-gray-900 hover:bg-gray-100">
                    Out of Stock
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </Badge>
            )}
            {branchFilter !== 'all' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Branch: {branches.find(b => b.id.toString() === branchFilter)?.name}
                <button
                  onClick={() => setBranchFilter('all')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Category: {categoryFilter}
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Status: {statusFilter.replace('_', ' ')}
                <button
                  onClick={() => setStatusFilter('all')}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredInventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-left py-3 px-4 font-medium">Branch</th>
                  <th className="text-left py-3 px-4 font-medium">SKU</th>
                  <th className="text-left py-3 px-4 font-medium">Stock</th>
                  <th className="text-left py-3 px-4 font-medium">Reorder Level</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Value</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item, index) => (
                  <tr
                    key={`${item.productId}-${item.branchId}-${index}`}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-500">
                          {item.categoryName || 'No Category'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{item.branchName}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{item.sku}</code>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            item.currentStock <= item.reorderLevel ? 'text-red-600 font-bold' : ''
                          }
                        >
                          {item.currentStock}
                        </span>
                        {item.currentStock <= item.reorderLevel && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.reorderLevel}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStockStatusColor(item.stockStatus)}>
                        {item.stockStatus.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">₹{item.stockValue}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openAdjustmentDialog(item)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Adjust
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Settings
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateInventory(item.productId, item.reorderLevel + 50, 'Quick restock')
                          }
                        >
                          Restock
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteProduct(item.productId, item.productName)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
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
            {filteredInventory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No inventory items found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Stock Adjustment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Stock</Label>
              <div className="text-2xl font-bold text-blue-600">{adjustmentData.newStock}</div>
            </div>

            <div>
              <Label>Adjustment Type</Label>
              <Select
                value={adjustmentData.adjustmentType}
                onValueChange={value =>
                  setAdjustmentData({
                    ...adjustmentData,
                    adjustmentType: value as 'increase' | 'decrease',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase Stock</SelectItem>
                  <SelectItem value="decrease">Decrease Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={adjustmentData.quantity}
                onChange={e =>
                  setAdjustmentData({
                    ...adjustmentData,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div>
              <Label>Reason</Label>
              <Input
                value={adjustmentData.reason}
                onChange={e =>
                  setAdjustmentData({
                    ...adjustmentData,
                    reason: e.target.value,
                  })
                }
                placeholder="Reason for adjustment..."
              />
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">New Stock Level:</div>
              <div className="text-xl font-bold">
                {adjustmentData.adjustmentType === 'increase'
                  ? adjustmentData.newStock + adjustmentData.quantity
                  : adjustmentData.newStock - adjustmentData.quantity}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={makeStockAdjustment}>
                <Save className="h-4 w-4 mr-2" />
                Apply Adjustment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Settings Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Stock Settings: {editingItem?.productName}</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label>Reorder Level</Label>
                <Input
                  type="number"
                  value={editingItem.reorderLevel}
                  onChange={e => {
                    const newLevel = parseInt(e.target.value) || 0;
                    setEditingItem({ ...editingItem, reorderLevel: newLevel });
                  }}
                />
              </div>

              <div>
                <Label>Maximum Stock</Label>
                <Input
                  type="number"
                  value={editingItem.maxStock}
                  onChange={e => {
                    const newMax = parseInt(e.target.value) || 0;
                    setEditingItem({ ...editingItem, maxStock: newMax });
                  }}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    updateStockSettings(
                      editingItem.productId,
                      editingItem.reorderLevel,
                      editingItem.maxStock
                    )
                  }
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update Settings
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
