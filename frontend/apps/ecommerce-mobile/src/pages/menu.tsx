import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MobileLayout from '@/components/layout/MobileLayout';

interface Category {
  id: number;
  name: string;
  nameTelugu?: string;
  description?: string;
  productCount?: number;
  imageUrl?: string;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching real categories for menu...');
        const response = await fetch('/api/direct-data/categories');
        if (response.ok) {
          const categoriesResponse = await response.json();
          console.log('Menu categories response:', categoriesResponse);
          setCategories(categoriesResponse.data || []);
        } else {
          console.error('Failed to fetch categories:', response.status);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('vegetable')) return '🥬';
    if (name.includes('fruit')) return '🍎';
    if (name.includes('dairy')) return '🥛';
    if (name.includes('grain') || name.includes('cereal')) return '🌾';
    if (name.includes('spice') || name.includes('herb')) return '🌿';
    if (name.includes('pulse') || name.includes('lentil')) return '🫘';
    if (name.includes('oil') || name.includes('ghee')) return '🫒';
    if (name.includes('snack')) return '🍿';
    if (name.includes('beverage')) return '🥤';
    return '🛒';
  };

  return (
    <MobileLayout>
      <Head>
        <title>Menu - Sri Venkateswara Organic Foods</title>
        <meta name="description" content="Browse our organic grocery categories" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Browse our organic product categories</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="ml-4 text-gray-600">Loading categories...</p>
          </div>
        ) : (
          <div className="px-4 py-6">
            <div className="grid grid-cols-2 gap-4">
              {categories.map(category => (
                <Link
                  key={category.id}
                  href={`/search?category=${category.name.toLowerCase()}`}
                  className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{getCategoryIcon(category.name)}</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h3>
                    {category.nameTelugu && (
                      <p className="text-xs text-green-600 mb-2">{category.nameTelugu}</p>
                    )}
                    {category.productCount !== undefined && (
                      <p className="text-xs text-gray-500">{category.productCount} items</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/search?featured=true"
                  className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">⭐</span>
                    <div>
                      <p className="font-medium text-gray-900">Featured Products</p>
                      <p className="text-sm text-gray-600">Best selling items</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>

                <Link
                  href="/search?discount=true"
                  className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🏷️</span>
                    <div>
                      <p className="font-medium text-gray-900">Special Offers</p>
                      <p className="text-sm text-gray-600">Discounted products</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>

                <Link
                  href="/search?fresh=true"
                  className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🌱</span>
                    <div>
                      <p className="font-medium text-gray-900">Fresh Arrivals</p>
                      <p className="text-sm text-gray-600">Recently added</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
