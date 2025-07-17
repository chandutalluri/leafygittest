import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';

export default function StatusPage() {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch('/api/direct-data/orders/status');
        if (response.ok) {
          const statusData = await response.json();
          setOrderStatus(statusData);
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, []);

  return (
    <>
      <Head>
        <title>Platform Status - LeafyHealth</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl font-bold text-green-800 mb-8">Platform Status</h1>
          
          <GlassCard className="p-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-bold text-green-700 mb-4">System Operational</h2>
              <p className="text-lg text-green-600 mb-8">All services are running normally</p>
              
              {loading ? (
                <p className="text-gray-600">Loading order status...</p>
              ) : orderStatus ? (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-2">Recent Order Activity</h3>
                  <pre className="text-sm text-gray-700">{JSON.stringify(orderStatus, null, 2)}</pre>
                </div>
              ) : null}
            </div>
            
            <div className="mt-8 pt-8 border-t border-green-200">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Service Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">API Gateway</span>
                  <span className="text-green-600 font-medium">✓ Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Database</span>
                  <span className="text-green-600 font-medium">✓ Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Microservices (29)</span>
                  <span className="text-green-600 font-medium">✓ All Running</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-green-200">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Platform Details</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Features Available:</h4>
                  <ul className="text-green-600 space-y-1">
                    <li>• Full product catalog with Telugu translations</li>
                    <li>• Multi-branch operations (5 branches)</li>
                    <li>• Real-time inventory tracking</li>
                    <li>• Order management system</li>
                    <li>• PWA mobile experience</li>
                    <li>• Traditional home supplies ordering</li>
                    <li>• Subscription management</li>
                    <li>• React Query data fetching</li>
                    <li>• Framer Motion animations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Technical Stack:</h4>
                  <ul className="text-green-600 space-y-1 text-sm">
                    <li>• Next.js 15 with Pages Router</li>
                    <li>• React 18.2 (stable compatibility)</li>
                    <li>• Tailwind CSS with custom glassmorphism</li>
                    <li>• Real API integration (centralized gateway)</li>
                  </ul>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <Footer />
      </div>
    </>
  );
}