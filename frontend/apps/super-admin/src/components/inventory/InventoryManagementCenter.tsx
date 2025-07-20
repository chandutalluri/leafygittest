/**
 * Industry-Standard Inventory Management Center
 * Comprehensive trading company inventory solution
 * Features: Multi-branch tracking, real-time adjustments, analytics, reorder management
 */

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

interface InventoryItem {
  productId: number;
  productName: string;
  sku: string;
  unitPrice: string;
  costPrice: string;
  categoryName: string | null;
  imageUrl?: string;
  branchId: number;
  branchName: string;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  lastUpdated: string;
  stockValue: string;
  stockStatus: 'out_of_stock' | 'critical' | 'low' | 'normal' | 'overstock';
  severity?: string;
  threshold?: number;
}

interface InventorySummary {
  totalSKUs: number;
  totalUnits: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  overstockCount: number;
}

interface StockAdjustmentModal {
  isOpen: boolean;
  item: InventoryItem | null;
}

interface InventoryHistory {
  id: number;
  transactionType: string;
  quantityChange: number;
  newQuantity: number;
  referenceType: string;
  notes: string;
  createdAt: string;
  createdBy: string;
}

export function InventoryManagementCenter() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [alerts, setAlerts] = useState<InventoryItem[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    showLowStockOnly: false,
  });

  const [adjustmentModal, setAdjustmentModal] = useState<StockAdjustmentModal>({
    isOpen: false,
    item: null,
  });

  const [adjustmentForm, setAdjustmentForm] = useState({
    adjustmentType: 'add',
    quantity: 0,
    notes: '',
  });

  const [historyModal, setHistoryModal] = useState({
    isOpen: false,
    productId: null as number | null,
    branchId: null as number | null,
    history: [] as InventoryHistory[],
  });

  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuthStore();

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (selectedBranch || filters.search || filters.category || filters.stockStatus) {
      fetchInventory();
    }
  }, [selectedBranch, filters.search, filters.category, filters.stockStatus]);

  const initializeData = async () => {
    setLoading(true);
    await Promise.all([fetchBranches(), fetchInventory(), fetchSummary(), fetchAlerts()]);
    setLoading(false);
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches');
      if (response.ok) {
        const result = await response.json();
        setBranches(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBranch) params.append('branchId', selectedBranch);
      if (filters.category) params.append('category', filters.category);
      if (filters.stockStatus) params.append('stockStatus', filters.stockStatus);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/inventory?${params.toString()}`);
      if (response.ok) {
        const result = await response.json();
        const inventoryData = result.data || [];
        setInventory(inventoryData);

        // Extract unique categories (using categoryName from actual data structure)
        const uniqueCategories = [
          ...new Set(inventoryData.map((item: any) => item.categoryName).filter(Boolean)),
        ];
        setCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const params = selectedBranch ? `?branchId=${selectedBranch}` : '';
      const response = await fetch(`/api/inventory/summary${params}`);
      if (response.ok) {
        const result = await response.json();
        console.log('Summary API Response:', result);
        if (result.success && result.data) {
          setSummary({
            totalSKUs: parseInt(result.data.total_skus) || 0,
            totalUnits: parseInt(result.data.total_units) || 0,
            totalValue: parseFloat(result.data.total_value) || 0,
            lowStockCount: parseInt(result.data.low_stock_count) || 0,
            outOfStockCount: parseInt(result.data.out_of_stock_count) || 0,
            overstockCount: parseInt(result.data.critical_stock_count) || 0,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/inventory/alerts');
      if (response.ok) {
        const result = await response.json();
        setAlerts(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleStockAdjustment = async () => {
    if (!adjustmentModal.item || adjustmentForm.quantity === 0) return;

    try {
      const response = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: adjustmentModal.item.productId,
          branchId: adjustmentModal.item.branchId,
          adjustmentType: adjustmentForm.adjustmentType,
          quantity:
            adjustmentForm.adjustmentType === 'subtract'
              ? -adjustmentForm.quantity
              : adjustmentForm.quantity,
          notes: adjustmentForm.notes,
          userId: user?.id,
        }),
      });

      if (response.ok) {
        await fetchInventory();
        await fetchSummary();
        await fetchAlerts();
        setAdjustmentModal({ isOpen: false, item: null });
        setAdjustmentForm({ adjustmentType: 'add', quantity: 0, notes: '' });
      }
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  const handleReorderRequest = async (item: InventoryItem) => {
    try {
      const quantity = Math.max(item.reorderLevel * 2, 50); // Smart reorder quantity
      const response = await fetch('/api/inventory/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: item.productId,
          branchId: item.branchId,
          quantity,
          userId: user?.id,
        }),
      });

      if (response.ok) {
        alert(`Reorder request created for ${quantity} units of ${item.productName}`);
      }
    } catch (error) {
      console.error('Error creating reorder request:', error);
    }
  };

  const fetchInventoryHistory = async (productId: number, branchId: number) => {
    try {
      const response = await fetch(`/api/inventory/history/${productId}/${branchId}`);
      if (response.ok) {
        const result = await response.json();
        setHistoryModal({
          isOpen: true,
          productId,
          branchId,
          history: result.data || [],
        });
      }
    } catch (error) {
      console.error('Error fetching inventory history:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overstock':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'critical':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'low':
        return <ArrowDownIcon className="h-4 w-4" />;
      case 'normal':
        return <CubeIcon className="h-4 w-4" />;
      case 'overstock':
        return <ArrowUpIcon className="h-4 w-4" />;
      default:
        return <CubeIcon className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredInventory = inventory.filter(item => {
    if (
      filters.showLowStockOnly &&
      !['out_of_stock', 'critical', 'low'].includes(item.stockStatus)
    ) {
      return false;
    }
    return true;
  });

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
          <CubeIcon className="h-8 w-8 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inventory Management Center</h2>
            <p className="text-sm text-gray-600">
              Industry-standard inventory tracking for trading operations
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Branches</option>
            {branches.map((branch, index) => (
              <option key={`branch-${branch.id}-${index}`} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              setFilters(prev => ({ ...prev, showLowStockOnly: !prev.showLowStockOnly }))
            }
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filters.showLowStockOnly
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filters.showLowStockOnly ? 'Show All' : 'Low Stock Only'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'alerts', name: 'Alerts', icon: BellIcon, count: alerts.length },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl rounded-lg p-4">
                <div className="flex items-center">
                  <CubeIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total SKUs</p>
                    <p className="text-xl font-semibold text-gray-900">{summary.totalSKUs}</p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl rounded-lg p-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Units</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {summary.totalUnits.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                    <p className="text-xl font-semibold text-gray-900">{summary.lowStockCount}</p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl rounded-lg p-4">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {formatCurrency(summary.totalValue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl rounded-lg p-4">
                <div className="flex items-center">
                  <MinusIcon className="h-8 w-8 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                    <p className="text-xl font-semibold text-gray-900">{summary.outOfStockCount}</p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl rounded-lg p-4">
                <div className="flex items-center">
                  <ArrowUpIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Overstock</p>
                    <p className="text-xl font-semibold text-gray-900">{summary.overstockCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl rounded-lg p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products or SKU..."
                    value={filters.search}
                    onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filters.category}
                  onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.stockStatus}
                  onChange={e => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="overstock">Overstock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Inventory Items ({filteredInventory.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reorder Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map(item => (
                    <tr
                      key={`inventory-row-${item.productId}-${item.branchId}-${item.sku}-${Date.now()}-${Math.random()}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.imageUrl && (
                            <img
                              className="h-10 w-10 rounded-lg object-cover mr-3"
                              src={item.imageUrl}
                              alt=""
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </div>
                            <div className="text-sm text-gray-500">{item.categoryName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.branchName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.currentStock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.reorderLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.stockStatus)}`}
                        >
                          {getStatusIcon(item.stockStatus)}
                          <span className="ml-1 capitalize">
                            {item.stockStatus.replace('_', ' ')}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(parseFloat(item.stockValue))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setAdjustmentModal({ isOpen: true, item })}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Adjust
                        </button>
                        <button
                          onClick={() => fetchInventoryHistory(item.productId, item.branchId)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          History
                        </button>
                        {['out_of_stock', 'critical', 'low'].includes(item.stockStatus) && (
                          <button
                            onClick={() => handleReorderRequest(item)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Reorder
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInventory.length === 0 && (
              <div className="text-center py-12">
                <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filters.search || filters.category || filters.stockStatus
                    ? 'Try adjusting your filters.'
                    : 'Inventory will appear here once products are created.'}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'alerts' && (
        <div className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Inventory Alerts ({alerts.length})
            </h3>
          </div>
          <div className="p-4">
            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts</h3>
                <p className="mt-1 text-sm text-gray-500">All inventory levels are healthy.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div
                    key={`alert-row-${alert.productId}-${alert.branchId}-${alert.severity}-${Date.now()}-${Math.random()}`}
                    className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{alert.productName}</p>
                        <p className="text-sm text-gray-600">
                          {alert.branchName} • Current: {alert.currentStock} • Threshold:{' '}
                          {alert.threshold}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setAdjustmentModal({ isOpen: true, item: alert })}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Adjust Stock
                      </button>
                      <button
                        onClick={() => handleReorderRequest(alert)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustmentModal.isOpen && adjustmentModal.item && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Adjust Stock - {adjustmentModal.item.productName}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branch</label>
                  <p className="text-sm text-gray-600">{adjustmentModal.item.branchName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Stock</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {adjustmentModal.item.currentStock}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adjustment Type</label>
                  <select
                    value={adjustmentForm.adjustmentType}
                    onChange={e =>
                      setAdjustmentForm(prev => ({ ...prev, adjustmentType: e.target.value }))
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="add">Add Stock</option>
                    <option value="subtract">Reduce Stock</option>
                    <option value="set">Set Stock Level</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={adjustmentForm.quantity}
                    onChange={e =>
                      setAdjustmentForm(prev => ({
                        ...prev,
                        quantity: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={adjustmentForm.notes}
                    onChange={e => setAdjustmentForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Reason for adjustment..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setAdjustmentModal({ isOpen: false, item: null });
                    setAdjustmentForm({ adjustmentType: 'add', quantity: 0, notes: '' });
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStockAdjustment}
                  disabled={adjustmentForm.quantity === 0}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Adjust Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory History Modal */}
      {historyModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-2/3 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Inventory History</h3>
                <button
                  onClick={() =>
                    setHistoryModal({ isOpen: false, productId: null, branchId: null, history: [] })
                  }
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Change
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        New Total
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        By
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historyModal.history.map(record => (
                      <tr key={record.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600 capitalize">
                          {record.transactionType.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span
                            className={
                              record.quantityChange >= 0 ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            {record.quantityChange >= 0 ? '+' : ''}
                            {record.quantityChange}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{record.newQuantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{record.createdBy}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{record.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {historyModal.history.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No history records found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
