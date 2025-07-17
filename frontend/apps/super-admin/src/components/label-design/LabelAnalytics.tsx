import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  PrinterIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalLabels: number;
  totalPrintJobs: number;
  averageLabelsPerJob: number;
  mostUsedTemplate: string;
  topProducts: { name: string; count: number }[];
  dailyPrints: { date: string; count: number }[];
  branchStats: { branch: string; labels: number }[];
  costSavings: number;
}

export default function LabelAnalytics() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Sample analytics data
  const analyticsData: AnalyticsData = {
    totalLabels: 15234,
    totalPrintJobs: 512,
    averageLabelsPerJob: 29.8,
    mostUsedTemplate: 'Avery L7160 (21 per sheet)',
    topProducts: [
      { name: 'Organic Bananas', count: 2341 },
      { name: 'Basmati Rice', count: 1892 },
      { name: 'Turmeric Powder', count: 1654 },
      { name: 'Coconut Oil', count: 1432 },
      { name: 'Red Chili Powder', count: 1205 },
    ],
    dailyPrints: [
      { date: 'Mon', count: 245 },
      { date: 'Tue', count: 312 },
      { date: 'Wed', count: 289 },
      { date: 'Thu', count: 356 },
      { date: 'Fri', count: 423 },
      { date: 'Sat', count: 198 },
      { date: 'Sun', count: 167 },
    ],
    branchStats: [
      { branch: 'Hyderabad Main', labels: 4532 },
      { branch: 'Visakhapatnam', labels: 3891 },
      { branch: 'Vijayawada', labels: 3245 },
      { branch: 'Tirupati', labels: 2198 },
      { branch: 'Warangal', labels: 1368 },
    ],
    costSavings: 45678,
  };

  const maxDailyCount = Math.max(...analyticsData.dailyPrints.map(d => d.count));
  const maxBranchLabels = Math.max(...analyticsData.branchStats.map(b => b.labels));

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Label Analytics Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setDateRange('week')}
            className={`px-4 py-2 rounded-lg ${
              dateRange === 'week'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-4 py-2 rounded-lg ${
              dateRange === 'month'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setDateRange('year')}
            className={`px-4 py-2 rounded-lg ${
              dateRange === 'year'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Labels Printed</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.totalLabels.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last {dateRange}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Print Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.totalPrintJobs}</p>
              <p className="text-sm text-gray-600 mt-1">Avg {analyticsData.averageLabelsPerJob}/job</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <PrinterIcon className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Most Used Template</p>
              <p className="text-lg font-bold text-gray-900">{analyticsData.mostUsedTemplate}</p>
              <p className="text-sm text-gray-600 mt-1">68% of all prints</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ArrowTrendingUpIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cost Savings</p>
              <p className="text-3xl font-bold text-gray-900">₹{analyticsData.costSavings.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">vs outsourced printing</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyRupeeIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Print Volume */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Daily Print Volume</h3>
          <div className="space-y-3">
            {analyticsData.dailyPrints.map((day) => (
              <div key={day.date} className="flex items-center">
                <span className="text-sm text-gray-600 w-12">{day.date}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-6 relative">
                    <div 
                      className="bg-emerald-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(day.count / maxDailyCount) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{day.count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Top Products by Label Count</h3>
          <div className="space-y-3">
            {analyticsData.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 w-6">{index + 1}.</span>
                  <span className="text-sm text-gray-700 ml-2">{product.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{product.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Statistics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Branch-wise Label Usage</h3>
        <div className="space-y-3">
          {analyticsData.branchStats.map((branch) => (
            <div key={branch.branch} className="flex items-center">
              <span className="text-sm text-gray-600 w-40">{branch.branch}</span>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-6 relative">
                  <div 
                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(branch.labels / maxBranchLabels) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{branch.labels.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <ClockIcon className="w-8 h-8 mb-2" />
          <h4 className="font-medium mb-1">Peak Hours</h4>
          <p className="text-sm opacity-90">Most labels printed between 10 AM - 12 PM</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <UserGroupIcon className="w-8 h-8 mb-2" />
          <h4 className="font-medium mb-1">Active Users</h4>
          <p className="text-sm opacity-90">23 staff members actively printing labels</p>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-lg text-white">
          <CalendarIcon className="w-8 h-8 mb-2" />
          <h4 className="font-medium mb-1">Busiest Day</h4>
          <p className="text-sm opacity-90">Friday sees 35% more prints than average</p>
        </div>
      </div>
    </div>
  );
}