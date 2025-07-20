import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from '@/components/layout/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import { AlertCircle, CheckCircle, Server, Database, Activity, Cpu, HardDrive } from 'lucide-react';

interface SystemMetrics {
  timestamp: string;
  system: {
    cpu: {
      count: number;
      usage: number;
      loadAverage: number[];
    };
    memory: {
      total: number;
      free: number;
      used: number;
      percentage: number;
    };
    uptime: number;
  };
  services: Array<{
    name: string;
    port: number;
    status: string;
    responseTime: number;
  }>;
  database: {
    activeConnections: number;
    databaseSize: number;
    healthy: boolean;
  };
}

export default function MonitoringDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchMetrics = async () => {
    try {
      const metricsResponse = await fetch('/api/performance-monitor/metrics');
      const dashboardResponse = await fetch('/api/performance-monitor/dashboard');

      if (!metricsResponse.ok || !dashboardResponse.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const metricsData = await metricsResponse.json();
      const dashboardData = await dashboardResponse.json();

      setMetrics(metricsData);
      setDashboard(dashboardData);
      setError(null);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'unhealthy':
        return 'text-yellow-600';
      case 'offline':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>System Monitoring - LeafyHealth</title>
      </Head>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">System Monitoring</h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={e => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Auto-refresh</span>
            </label>
            <button
              onClick={fetchMetrics}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Refresh Now
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            Error loading metrics: {error}
          </div>
        )}

        {dashboard && (
          <>
            {/* Health Score Overview */}
            <GlassCard className="p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">System Health</h2>
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-5xl font-bold ${
                        dashboard.overview.healthScore >= 80
                          ? 'text-green-600'
                          : dashboard.overview.healthScore >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}
                    >
                      {dashboard.overview.healthScore}%
                    </div>
                    <div>
                      <p className="text-lg font-medium">{dashboard.overview.status}</p>
                      <p className="text-sm text-gray-500">
                        Last updated:{' '}
                        {new Date(dashboard.overview.lastUpdated).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    dashboard.overview.healthScore >= 80
                      ? 'bg-green-100'
                      : dashboard.overview.healthScore >= 60
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                  }`}
                >
                  {dashboard.overview.healthScore >= 80 ? (
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  ) : (
                    <AlertCircle className="w-12 h-12 text-yellow-600" />
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Alerts */}
            {dashboard.alerts && dashboard.alerts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Active Alerts</h3>
                <div className="space-y-2">
                  {dashboard.alerts.map((alert: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        alert.level === 'critical'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle
                          className={`w-5 h-5 ${
                            alert.level === 'critical' ? 'text-red-600' : 'text-yellow-600'
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            alert.level === 'critical' ? 'text-red-800' : 'text-yellow-800'
                          }`}
                        >
                          {alert.message}
                        </span>
                      </div>
                      {alert.services && (
                        <div className="mt-2 ml-7 text-sm text-gray-600">
                          Services: {alert.services.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">CPU Usage</h3>
                  <Cpu className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{dashboard.system.cpu}</div>
                <div className="mt-2 text-sm text-gray-500">
                  Load Average: {metrics?.system.cpu.loadAverage.map(v => v.toFixed(2)).join(', ')}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Memory Usage</h3>
                  <HardDrive className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{dashboard.system.memory}</div>
                <div className="mt-2 text-sm text-gray-500">
                  {formatBytes(metrics?.system.memory.used || 0)} /{' '}
                  {formatBytes(metrics?.system.memory.total || 0)}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">System Uptime</h3>
                  <Activity className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{dashboard.system.uptime}</div>
                <div className="mt-2 text-sm text-gray-500">Since last restart</div>
              </GlassCard>
            </div>

            {/* Services Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Services Status</h3>
                  <Server className="w-6 h-6 text-gray-400" />
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold">
                    {dashboard.services.healthy} / {dashboard.services.total} Healthy
                  </div>
                </div>
                <div className="space-y-2">
                  {dashboard.services.details.map((service: any) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            service.status === 'healthy'
                              ? 'bg-green-500'
                              : service.status === 'unhealthy'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                        />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={getStatusColor(service.status)}>{service.status}</span>
                        {service.responseTime > 0 && (
                          <span className="text-gray-500">{service.responseTime}ms</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Database Status</h3>
                  <Database className="w-6 h-6 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Status</span>
                      <span
                        className={`font-medium ${dashboard.database.healthy ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {dashboard.database.healthy ? 'Healthy' : 'Unhealthy'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Active Connections</span>
                      <span className="font-medium">{dashboard.database.activeConnections}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Database Size</span>
                      <span className="font-medium">
                        {formatBytes(dashboard.database.databaseSize)}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
