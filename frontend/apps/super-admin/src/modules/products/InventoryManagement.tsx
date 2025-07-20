/**
 * Inventory Management Component
 * Real-time inventory tracking and management
 */

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon as SearchIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface InventoryItem {
  id: number;
  product_id: number;
  product_name: string;
  current_stock: number;
  reorder_level: number;
  price: number;
  last_updated: string;
  stock_status: 'low' | 'normal' | 'high';
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adjustingStock, setAdjustingStock] = useState<number | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, statusFilter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/direct-data/inventory', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const inventoryData =
          data.inventory?.map((item: any) => ({
            ...item,
            stock_status: getStockStatus(item.current_stock, item.reorder_level),
          })) || [];
        setInventory(inventoryData);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (
    currentStock: number,
    reorderLevel: number
  ): 'low' | 'normal' | 'high' => {
    if (currentStock <= reorderLevel) return 'low';
    if (currentStock <= reorderLevel * 2) return 'normal';
    return 'high';
  };

  const filterInventory = () => {
    let filtered = [...inventory];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.stock_status === statusFilter);
    }

    setFilteredInventory(filtered);
  };

  const handleStockAdjustment = async (itemId: number) => {
    if (stockAdjustment === 0) return;

    try {
      const response = await fetch(`/api/direct-data/inventory/${itemId}/adjust`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adjustment: stockAdjustment }),
      });

      if (response.ok) {
        setInventory(prev =>
          prev.map(item =>
            item.id === itemId
              ? {
                  ...item,
                  current_stock: item.current_stock + stockAdjustment,
                  stock_status: getStockStatus(
                    item.current_stock + stockAdjustment,
                    item.reorder_level
                  ),
                }
              : item
          )
        );
        setAdjustingStock(null);
        setStockAdjustment(0);
      }
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'normal':
        return <MinusIcon className="h-4 w-4" />;
      case 'high':
        return <ArrowUpIcon className="h-4 w-4" />;
      default:
        return <CubeIcon className="h-4 w-4" />;
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
          <CubeIcon className="h-8 w-8 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
            <p className="text-sm text-gray-600">
              Track and manage stock levels across all products
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl rounded-lg border">
          <div className="p-4">
            <div className="flex items-center">
              <CubeIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-xl font-semibold text-gray-900">{inventory.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl rounded-lg border">
          <div className="p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-xl font-semibold text-gray-900">
                  {inventory.filter(item => item.stock_status === 'low').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl rounded-lg border">
          <div className="p-4">
            <div className="flex items-center">
              <ArrowUpIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-xl font-semibold text-gray-900">
                  {inventory.filter(item => item.stock_status === 'high').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl rounded-lg border">
          <div className="p-4">
            <div className="flex items-center">
              <CubeIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹
                  {inventory
                    .reduce((sum, item) => sum + item.current_stock * item.price, 0)
                    .toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="low">Low Stock</option>
                <option value="normal">Normal</option>
                <option value="high">High Stock</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Inventory Items</h3>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Current Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Reorder Level</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-500">ID: {item.product_id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {adjustingStock === item.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={stockAdjustment}
                            onChange={e => setStockAdjustment(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="±"
                          />
                          <button
                            onClick={() => handleStockAdjustment(item.id)}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setAdjustingStock(null);
                              setStockAdjustment(0);
                            }}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="font-medium">{item.current_stock}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{item.reorder_level}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(item.stock_status)}`}
                      >
                        {getStatusIcon(item.stock_status)}
                        <span className="capitalize">{item.stock_status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">₹{(item.current_stock * item.price).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      {adjustingStock !== item.id && (
                        <button
                          onClick={() => setAdjustingStock(item.id)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Adjust Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInventory.length === 0 && !loading && (
            <div className="text-center py-12">
              <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search terms.'
                  : 'Inventory will appear here once products are created.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
