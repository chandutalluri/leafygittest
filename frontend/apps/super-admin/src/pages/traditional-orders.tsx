import { useState, useEffect } from 'react';
import Head from 'next/head';
// import Layout from '../components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Building,
  BarChart3,
  Filter,
  Download,
} from 'lucide-react';
import axios from 'axios';

interface SystemStatistics {
  overview: {
    total_orders: number;
    pending_orders: number;
    processing_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    total_revenue: number;
    average_order_value: number;
    unique_customers: number;
    active_branches: number;
  };
  quality_breakdown: Array<{
    quality_tier: string;
    count: number;
    revenue: number;
  }>;
  branch_performance: Array<{
    branch_name: string;
    order_count: number;
    revenue: number;
  }>;
}

interface Order {
  id: number;
  customer_name: string;
  branch_name: string;
  quality_tier: string;
  total_amount: number;
  order_status: string;
  order_date: string;
}

export default function TraditionalOrdersSuperAdminPage() {
  const [statistics, setStatistics] = useState<SystemStatistics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    fetchStatistics();
    fetchBranches();
    fetchOrders();
  }, [filterStatus, filterBranch]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/traditional/system-statistics');
      setStatistics(response.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('/api/company-management/branches');
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/api/traditional/all-orders?limit=100';
      if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`;
      }
      if (filterBranch !== 'all') {
        url += `&branch_id=${filterBranch}`;
      }

      const response = await axios.get(url);
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Create CSV data
    const headers = ['Order ID', 'Customer', 'Branch', 'Quality', 'Amount', 'Status', 'Date'];
    const csvData = [
      headers.join(','),
      ...orders.map(order =>
        [
          order.id,
          order.customer_name,
          order.branch_name,
          order.quality_tier,
          order.total_amount,
          order.order_status,
          new Date(order.order_date).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traditional-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getQualityDisplay = (tier: string) => {
    switch (tier) {
      case 'ordinary':
        return { symbol: '₹', color: 'text-gray-600' };
      case 'medium':
        return { symbol: '₹₹', color: 'text-blue-600' };
      case 'best':
        return { symbol: '₹₹₹', color: 'text-emerald-600' };
      default:
        return { symbol: tier, color: 'text-gray-600' };
    }
  };

  return (
    <div className="p-4">
      <Head>
        <title>Traditional Orders System - Super Admin</title>
      </Head>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Traditional Orders System</h1>
          <p className="text-gray-600">
            System-wide overview and management for traditional home supplies
          </p>
        </div>

        {/* Statistics Overview */}
        {statistics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold">{statistics.overview.total_orders}</p>
                  </div>
                  <Package className="w-10 h-10 text-emerald-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold">
                      ₹{statistics.overview.total_revenue.toFixed(0)}
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Unique Customers</p>
                    <p className="text-3xl font-bold">{statistics.overview.unique_customers}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Branches</p>
                    <p className="text-3xl font-bold">{statistics.overview.active_branches}</p>
                  </div>
                  <Building className="w-10 h-10 text-purple-500" />
                </div>
              </Card>
            </div>

            {/* Order Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Order Status Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending</span>
                    <span className="font-semibold text-yellow-600">
                      {statistics.overview.pending_orders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processing</span>
                    <span className="font-semibold text-blue-600">
                      {statistics.overview.processing_orders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Shipped</span>
                    <span className="font-semibold text-purple-600">
                      {statistics.overview.shipped_orders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Delivered</span>
                    <span className="font-semibold text-green-600">
                      {statistics.overview.delivered_orders}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Quality Tier Performance
                </h3>
                <div className="space-y-3">
                  {statistics.quality_breakdown.map(quality => {
                    const display = getQualityDisplay(quality.quality_tier);
                    return (
                      <div key={quality.quality_tier} className="flex justify-between items-center">
                        <span className={`text-sm ${display.color} font-medium`}>
                          {display.symbol}{' '}
                          {quality.quality_tier.charAt(0).toUpperCase() +
                            quality.quality_tier.slice(1)}
                        </span>
                        <div className="text-right">
                          <span className="font-semibold">{quality.count} orders</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ₹{quality.revenue.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Branch Performance */}
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Branch Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Branch</th>
                      <th className="text-right py-2">Orders</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">Avg Order Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.branch_performance.map(branch => (
                      <tr key={branch.branch_name} className="border-b">
                        <td className="py-2">{branch.branch_name}</td>
                        <td className="text-right">{branch.order_count}</td>
                        <td className="text-right">₹{branch.revenue?.toFixed(0) || '0'}</td>
                        <td className="text-right">
                          ₹
                          {branch.order_count > 0
                            ? (branch.revenue / branch.order_count).toFixed(0)
                            : '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* Orders List */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <select
                value={filterBranch}
                onChange={e => setFilterBranch(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={exportData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Order ID</th>
                    <th className="text-left py-3">Customer</th>
                    <th className="text-left py-3">Branch</th>
                    <th className="text-left py-3">Quality</th>
                    <th className="text-right py-3">Amount</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const quality = getQualityDisplay(order.quality_tier);
                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">#{order.id}</td>
                        <td className="py-3">{order.customer_name}</td>
                        <td className="py-3">{order.branch_name}</td>
                        <td className={`py-3 ${quality.color}`}>{quality.symbol}</td>
                        <td className="py-3 text-right">₹{order.total_amount}</td>
                        <td className="py-3">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs
                            ${order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.order_status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                            ${order.order_status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                            ${order.order_status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                          `}
                          >
                            {order.order_status}
                          </span>
                        </td>
                        <td className="py-3">{new Date(order.order_date).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
