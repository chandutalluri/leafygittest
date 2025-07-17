import { useState, useEffect } from 'react';
import { Search, ArrowLeft, Filter, X } from 'lucide-react';
import { useRouter } from 'next/router';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/query-client';

interface Product {
  id: string;
  name: string;
  name_telugu: string;
  selling_price: number;
  unit: string;
  image_url: string;
  category_name: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices', 'Oils', 'Dairy', 'Snacks'];

  const recentSearches = ['Organic Tomatoes', 'Basmati Rice', 'Fresh Spinach', 'Turmeric Powder'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/direct-data/products');
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.name_telugu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(product =>
        product.category_name?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('leafy_cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        name_telugu: product.name_telugu,
        price: product.selling_price,
        quantity: 1,
        image_url: product.image_url,
        unit: product.unit,
      });
    }

    localStorage.setItem('leafy_cart', JSON.stringify(cart));
  };

  return (
    <MobileLayout>
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-emerald-700 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Search Products</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search organic products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-white text-gray-900 border-0"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                  className={`whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 border-gray-300'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {!searchQuery && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Recent Searches</h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:bg-gray-50"
                    onClick={() => setSearchQuery(search)}
                  >
                    <Search className="h-4 w-4 mr-3" />
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {filteredProducts.length} results for "{searchQuery}"
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={product.image_url || '/api/placeholder/80/80'}
                        alt={product.name}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={e => {
                          e.currentTarget.src = '/api/placeholder/80/80';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        {product.name_telugu && (
                          <p className="text-sm text-gray-500">{product.name_telugu}</p>
                        )}
                        <p className="text-xs text-gray-400 mb-1">{product.category_name}</p>
                        <p className="text-emerald-600 font-bold text-lg">
                          ₹{product.selling_price.toFixed(2)}/{product.unit}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {searchQuery && filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">Try searching with different keywords</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
