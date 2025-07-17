import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Category {
  id: number;
  name: string;
  nameTelugu?: string;
  description?: string;
  productCount?: number;
  isActive?: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching real categories from API...');
        const response = await fetch('/api/direct-data/categories');
        if (response.ok) {
          const categoriesResponse = await response.json();
          console.log('Categories response:', categoriesResponse);
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
    return '🛒'; // Default icon
  };

  return (
    <>
      <Head>
        <title>Categories - LeafyHealth</title>
        <meta name="description" content="Browse our organic grocery categories" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Header />

        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Shop by Category
              </h1>
              <p className="text-xl text-gray-600">
                Discover fresh, organic products in every category
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading authentic categories...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.name.toLowerCase()}`}
                  >
                    <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8 text-center hover:bg-white/80 transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                      <div className="text-6xl mb-4">{getCategoryIcon(category.name)}</div>
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors mb-3">
                        {category.name}
                      </h3>
                      {category.nameTelugu && (
                        <p className="text-sm text-green-600 mb-2 font-medium">
                          {category.nameTelugu}
                        </p>
                      )}
                      <p className="text-gray-600">
                        {category.description || `Fresh organic ${category.name.toLowerCase()}`}
                      </p>
                      {category.productCount !== undefined && (
                        <p className="text-xs text-gray-500 mt-2">
                          {category.productCount} products available
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
