import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { MapPin, Star, ShoppingCart, Bell, Gift, Search, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';
import MobileLayout from '../components/layout/MobileLayout';
import { useQuery } from '@tanstack/react-query';
import { useBranchStore } from '../lib/stores/useBranchStore';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../lib/stores/useCartStore';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  nameTelugu: string;
  slug: string;
  imageUrl?: string;
}

interface Product {
  id: number;
  name: string;
  nameTelugu: string;
  price: number;
  unit: string;
  imageUrl?: string;
  isFeatured: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { latitude, longitude, city, state } = useGeolocation();
  const { selectedBranch, setSelectedBranch } = useBranchStore();
  const { getTotalItems, addItem } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Auto-select first branch if none selected
  useEffect(() => {
    if (!selectedBranch) {
      const defaultBranch = {
        id: 1,
        name: 'Sri Venkateswara Organic Foods - Hyderabad',
        code: 'SVF-HYD',
        address: 'Plot No. 123, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        latitude: 17.4232,
        longitude: 78.4554,
        phone: '+91 40 2355 1234',
        openingTime: '07:00',
        closingTime: '21:00',
        isActive: true,
        companyId: 1,
      };
      setSelectedBranch(defaultBranch);
    }
  }, [selectedBranch, setSelectedBranch]);

  // Fetch featured categories (max 6)
  const { data: categoriesResponse } = useQuery({
    queryKey: ['/api/direct-data/categories'],
    queryFn: async () => {
      console.log('Fetching categories...');
      const response = await fetch('/api/direct-data/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const result = await response.json();
      console.log('Categories response:', result);
      return result;
    },
  });

  // Fetch featured products
  const { data: productsResponse } = useQuery({
    queryKey: ['/api/direct-data/products'],
    queryFn: async () => {
      console.log('Fetching products...');
      const response = await fetch('/api/direct-data/products?limit=8');
      if (!response.ok) throw new Error('Failed to fetch products');
      const result = await response.json();
      console.log('Products response:', result);
      console.log('Products data:', result.data);
      console.log('Products count:', result.data?.length);
      console.log('Setting loading to false');
      return result;
    },
  });

  const categories = categoriesResponse?.data?.slice(0, 6) || [];
  const featuredProducts =
    productsResponse?.data?.filter((p: Product) => p.isFeatured)?.slice(0, 8) || [];

  const handleAddToCart = (product: Product) => {
    if (!selectedBranch) {
      toast.error('Please select a delivery location first');
      return;
    }

    addItem({
      id: product.id.toString(),
      name: product.name,
      name_telugu: product.nameTelugu,
      price: product.price,
      unit: product.unit,
      branchId: selectedBranch.id.toString(),
      maxQuantity: 99,
    });

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <>
      <Head>
        <title>LeafyHealth - Telugu Organic Groceries</title>
        <meta name="description" content="Fresh Telugu organic groceries delivered to your door" />
      </Head>

      <MobileLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header with Location and Cart */}
          <div className="bg-white shadow-sm border-b">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedBranch?.name || 'Select Location'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {city && state ? `${city}, ${state}` : 'Tap to choose delivery area'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => router.push('/mobile/cart')} className="relative p-2">
                    <ShoppingCart className="h-6 w-6 text-gray-600" />
                    {isHydrated && getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Welcome to LeafyHealth</h1>
                <p className="text-green-100 mt-1">Fresh Telugu organic groceries delivered</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Gift className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-4 bg-white">
            <button
              onClick={() => router.push('/search')}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-left text-gray-500 flex items-center space-x-3"
            >
              <Search className="h-5 w-5" />
              <span>Search for organic products...</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-4 bg-white mt-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/categories')}
                className="flex flex-col items-center space-y-2 p-3 bg-blue-50 rounded-lg"
              >
                <div className="bg-blue-500 p-2 rounded-full">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14-7H5m14 14H5"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-blue-700">Categories</span>
              </button>

              <button
                onClick={() => router.push('/traditional')}
                className="flex flex-col items-center space-y-2 p-3 bg-orange-50 rounded-lg"
              >
                <div className="bg-orange-500 p-2 rounded-full">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-medium text-orange-700">Traditional</span>
              </button>

              <button
                onClick={() => router.push('/offers')}
                className="flex flex-col items-center space-y-2 p-3 bg-red-50 rounded-lg"
              >
                <div className="bg-red-500 p-2 rounded-full">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-red-700">Offers</span>
              </button>

              <button
                onClick={() => router.push('/orders')}
                className="flex flex-col items-center space-y-2 p-3 bg-green-50 rounded-lg"
              >
                <div className="bg-green-500 p-2 rounded-full">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-700">Orders</span>
              </button>

              <button
                onClick={() => router.push('/help')}
                className="flex flex-col items-center space-y-2 p-3 bg-purple-50 rounded-lg"
              >
                <div className="bg-purple-500 p-2 rounded-full">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-purple-700">Help</span>
              </button>
            </div>
          </div>

          {/* Featured Categories */}
          {categories.length > 0 && (
            <div className="px-4 py-4 bg-white mt-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Shop by Category</h2>
                <button
                  onClick={() => router.push('/categories')}
                  className="text-green-600 text-sm font-medium"
                >
                  See All
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((category: Category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/mobile/categories/${category.slug}`)}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500 text-center">{category.nameTelugu}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="px-4 py-4 bg-white mt-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Featured Products</h2>
                <button
                  onClick={() => router.push('/mobile/products')}
                  className="text-green-600 text-sm font-medium"
                >
                  See All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {featuredProducts.map((product: Product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-bold text-xl">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{product.nameTelugu}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-green-600">₹{product.price}</span>
                          <span className="text-xs text-gray-500 ml-1">/{product.unit}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Padding for Navigation */}
          <div className="h-20"></div>
        </div>
      </MobileLayout>
    </>
  );
}
