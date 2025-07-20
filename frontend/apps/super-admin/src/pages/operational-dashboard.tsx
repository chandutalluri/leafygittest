import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../stores/authStore';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// Dashboard metrics configuration
const dashboardMetrics = [
  {
    title: 'Total Products',
    value: '0',
    icon: ShoppingBag,
    color: 'bg-blue-500',
    change: '+12%',
    changeType: 'positive',
  },
  {
    title: 'Active Orders',
    value: '0',
    icon: Activity,
    color: 'bg-orange-500',
    change: '+8%',
    changeType: 'positive',
  },
  {
    title: 'Total Users',
    value: '0',
    icon: Users,
    color: 'bg-green-500',
    change: '+15%',
    changeType: 'positive',
  },
  {
    title: 'Revenue Today',
    value: '₹0',
    icon: DollarSign,
    color: 'bg-purple-500',
    change: '+5%',
    changeType: 'positive',
  },
];

const systemStatus = [
  {
    service: 'Database Connection',
    status: 'operational',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    service: 'API Gateway',
    status: 'operational',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    service: 'Microservices',
    status: 'operational',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    service: 'Frontend Apps',
    status: 'operational',
    icon: CheckCircle,
    color: 'text-green-600',
  },
];

export default function OperationalDashboard() {
  const [metrics, setMetrics] = useState(dashboardMetrics);

  // Simulate loading real data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API calls
        // For now, keep the default metrics
        console.log('Dashboard loaded successfully');
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout
      title="Operational Dashboard"
      description="Complete business operations overview"
      activeDomain="dashboard"
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p
                    className={`text-sm ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {metric.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full ${metric.color}`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStatus.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.service}</p>
                  <p className="text-xs text-gray-500 capitalize">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">System initialized successfully</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Database connection established</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Analytics service started</p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <ShoppingBag className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Add Product</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Manage Users</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">View Analytics</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
