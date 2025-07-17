import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { apiClient } from '@/lib/api';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import { useCartStore } from '@/lib/stores/useCartStore';
import MobileLayout from '@/components/layout/MobileLayout';
import GlassCard from '@/components/ui/GlassCard';
import BranchSelectorModal from '../components/modals/BranchSelectorModal';
import { formatPrice } from '@/lib/utils';
import { ShoppingCartIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (router.query.category as string) || 'all'
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const { selectedBranch } = useBranchStore();
  const { addItem } = useCartStore();

  // Fetch products with filters
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, selectedBranch?.id],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory && selectedCategory !== 'all')
          params.append('category', selectedCategory);
        if (selectedBranch?.id) params.append('branchId', selectedBranch.id);

        return await apiClient.getProducts(params);
      } catch (error) {
        return { data: [] };
      }
    },
    retry: false,
  });

  // Fetch categories for filter dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await apiClient.getCategories();
      } catch (error) {
        return { data: [] };
      }
    },
    retry: false,
  });

  const handleAddToCart = (product: any) => {
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
        <title>Products - LeafyHealth</title>
        <meta
          name="description"
          content="Browse our wide selection of fresh organic groceries, vegetables, fruits and healthy products."
        />
      </Head>

      <MobileLayout>
        <div className="px-4 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Fresh Organic Products</h1>
            <p className="text-gray-600">Discover our premium selection of organic groceries</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <GlassCard className="p-4">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  <option value="">All Categories</option>
                  {(categories as any)?.data?.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="created_desc">Newest First</option>
                </select>
              </div>
            </GlassCard>
          </motion.div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="loading-skeleton h-64 rounded-xl" />
              ))}
            </div>
          ) : (products as any)?.data?.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {(products as any).data.map((product: any, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard className="product-card group">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-green-100 to-emerald-100">
                          🥬
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors text-sm line-clamp-2">
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className="text-xs text-gray-600 line-clamp-1">{product.description}</p>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-sm font-bold text-green-600">
                          ${(product.price || 0).toFixed(2)}
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-green-600 transition-colors"
                        >
                          <ShoppingCartIcon className="h-3 w-3" />
                          Add
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center py-12"
            >
              <GlassCard className="p-8">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Try adjusting your search criteria or browse our categories.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setPriceRange({ min: '', max: '' });
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  Clear Filters
                </button>
              </GlassCard>
            </motion.div>
          )}

          {/* Load More Button */}
          {(products as any)?.data?.length > 0 && (products as any)?.hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-8"
            >
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors">
                Load More Products
              </button>
            </motion.div>
          )}
        </div>
      </MobileLayout>
    </>
  );
}
