import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Search, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Grid3X3, 
  List, 
  Package2, 
  Clock, 
  Star, 
  CheckCircle2, 
  LayoutGrid,
  Zap,
  Award,
  Heart
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import { useCartStore } from '@/lib/stores/useCartStore';
import { toast } from 'react-hot-toast';
import { TraditionalItem, Category, QualityTier } from '../types/traditional';

const qualityTiers: QualityTier[] = [
  { id: 'ordinary', label: 'Ordinary', description: 'Good value for money' },
  { id: 'medium', label: 'Medium', description: 'Better quality' },
  { id: 'best', label: 'Best', description: 'Premium quality' }
];

// Flexible quantity options for different product types
const getQuantityOptions = (category: string, unit: string) => {
  switch (category.toLowerCase()) {
    case 'spices':
      return [
        { value: 0.01, label: '10g', step: 0.01 },
        { value: 0.025, label: '25g', step: 0.025 },
        { value: 0.05, label: '50g', step: 0.05 },
        { value: 0.1, label: '100g', step: 0.1 },
        { value: 0.25, label: '250g', step: 0.25 },
        { value: 0.5, label: '500g', step: 0.5 },
        { value: 1, label: '1kg', step: 1 }
      ];
    case 'dry fruits':
      return [
        { value: 0.1, label: '100g', step: 0.1 },
        { value: 0.25, label: '250g', step: 0.25 },
        { value: 0.5, label: '500g', step: 0.5 },
        { value: 1, label: '1kg', step: 1 },
        { value: 2, label: '2kg', step: 1 }
      ];
    case 'oils':
      if (unit === 'liter') {
        return [
          { value: 0.5, label: '500ml', step: 0.5 },
          { value: 1, label: '1L', step: 1 },
          { value: 2, label: '2L', step: 1 },
          { value: 5, label: '5L', step: 1 }
        ];
      }
      return [
        { value: 0.5, label: '500g', step: 0.5 },
        { value: 1, label: '1kg', step: 1 },
        { value: 2, label: '2kg', step: 1 },
        { value: 5, label: '5kg', step: 1 }
      ];
    default:
      return [
        { value: 0.5, label: '500g', step: 0.5 },
        { value: 1, label: '1kg', step: 1 },
        { value: 2, label: '2kg', step: 1 },
        { value: 5, label: '5kg', step: 1 },
        { value: 10, label: '10kg', step: 5 }
      ];
  }
};

export default function TraditionalSuppliesEnhanced() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { addItem, updateQuantity: updateCartQuantity } = useCartStore();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<TraditionalItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('ordinary');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [viewMode, setViewMode] = useState<'list' | 'box'>('box');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!selectedBranch) {
      router.push('/customer');
      return;
    }
    fetchCategories();
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedBranch) {
      fetchItems();
    }
  }, [selectedCategory, selectedBranch]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/traditional/categories?branchId=${selectedBranch?.id}`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/traditional/items?branchId=${selectedBranch?.id}&category=${selectedCategory}`
      );
      const data = await response.json();
      
      // Ensure data is an array
      const itemsArray = Array.isArray(data) ? data : [];
      setItems(itemsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
      setLoading(false);
    }
  };

  const getPrice = (item: TraditionalItem) => {
    switch (selectedQuality) {
      case 'medium':
        return item.prices?.medium || 0;
      case 'best':
        return item.prices?.best || 0;
      default:
        return item.prices?.ordinary || 0;
    }
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta)
    }));
  };

  const setSpecificQuantity = (itemId: number, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        // Reset quantity when deselecting
        setQuantities(prevQty => ({
          ...prevQty,
          [itemId]: 0
        }));
      } else {
        newSet.add(itemId);
        // Set default quantity when selecting
        if (!quantities[itemId]) {
          setQuantities(prevQty => ({
            ...prevQty,
            [itemId]: 1
          }));
        }
      }
      return newSet;
    });
  };

  const addToCart = (item: TraditionalItem) => {
    const quantity = quantities[item.id] || 1;
    if (quantity === 0) {
      toast.error('Please select a quantity');
      return;
    }

    addItem({
      id: item.id.toString(),
      name: item.name,
      name_telugu: item.name_telugu,
      price: getPrice(item),
      unit: item.unit,
      category: item.category,
      branchId: selectedBranch?.id?.toString() || '1'
    });

    if (quantity > 1) {
      updateCartQuantity(item.id.toString(), quantity);
    }

    toast.success(`Added ${quantity} ${item.unit} of ${item.name} to cart`);
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
  };

  // Calculate total amount for the provisional list
  const calculateTotalAmount = (): number => {
    let total = 0;
    selectedItems.forEach(itemId => {
      const item = items.find(i => i.id === itemId);
      const quantity = quantities[itemId] || 0;
      if (item && quantity > 0) {
        total += getPrice(item) * quantity;
      }
    });
    return total;
  };

  // Add entire provisional list as a single cart item
  const addProvisionalListToCart = () => {
    if (selectedItems.size === 0) {
      toast.error('Please select items for your monthly provisional list');
      return;
    }

    const totalAmount = calculateTotalAmount();
    const itemCount = selectedItems.size;
    
    // Create list of selected items for description
    const selectedItemsList: string[] = [];
    selectedItems.forEach(itemId => {
      const item = items.find(i => i.id === itemId);
      const quantity = quantities[itemId] || 0;
      if (item && quantity > 0) {
        selectedItemsList.push(`${quantity} ${item.unit} ${item.name_telugu || item.name}`);
      }
    });

    // Add as single "Traditional Home Supplies" cart item
    addItem({
      id: `traditional-${Date.now()}`,
      name: `Traditional Home Supplies (${itemCount} items)`,
      name_telugu: `సాంప్రదాయ గృహావసరాలు (${itemCount} వస్తువులు)`,
      price: totalAmount,
      unit: 'list',
      category: 'Traditional Provisional List',
      branchId: selectedBranch?.id?.toString() || '1',

    });

    toast.success(`Monthly provisional list added to cart! ₹${totalAmount.toFixed(2)} for ${itemCount} items`);
    setSelectedItems(new Set());
    setQuantities({});
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name_telugu?.includes(searchQuery)
  );

  const renderBoxView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredItems.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                <p className="text-green-600 font-medium text-sm">{item.name_telugu}</p>
                <p className="text-xs text-gray-500 mt-1">{item.category}</p>
              </div>
              <button
                onClick={() => toggleItemSelection(item.id)}
                className={`p-2 rounded-full transition-colors ${
                  selectedItems.has(item.id) 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500'
                }`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-2xl font-bold text-green-600">
                ₹{getPrice(item).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">per {item.unit}</p>
            </div>

            {item.isAvailable ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  {getQuantityOptions(item.category, item.unit).slice(0, 6).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSpecificQuantity(item.id, option.value)}
                      className={`text-xs py-1 px-2 rounded transition-colors ${
                        quantities[item.id] === option.value
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => updateQuantity(item.id, -0.1)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium">
                    {quantities[item.id] || 0} {item.unit}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 0.1)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-3">Out of Stock</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Traditional Home Supplies</h3>
          <button
            onClick={addProvisionalListToCart}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add Entire List ({selectedItems.size} items)
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleItemSelection(item.id)}
                className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                  selectedItems.has(item.id) 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500'
                }`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-green-600">{item.name_telugu}</p>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    ₹{getPrice(item).toFixed(2)}
                    <span className="text-xs text-gray-500 ml-1">per {item.unit}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {getQuantityOptions(item.category, item.unit).slice(0, 4).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSpecificQuantity(item.id, option.value)}
                      className={`text-xs py-1 px-2 rounded transition-colors ${
                        quantities[item.id] === option.value
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, -0.1)}
                    className="p-1"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium min-w-[60px] text-center">
                    {quantities[item.id] || 0} {item.unit}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 0.1)}
                    className="p-1"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Traditional Home Supplies</h1>
              <p className="text-green-100">Order daily essentials from SVOF {selectedBranch?.name} Main</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 bg-green-700 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">2-Minute Ordering</span>
                </div>
                <div className="flex items-center gap-2 bg-green-700 px-3 py-1 rounded-full">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">Monthly Bulk Orders</span>
                </div>
                <div className="flex items-center gap-2 bg-green-700 px-3 py-1 rounded-full">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">3 Quality Tiers</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/10 rounded-lg p-4">
                <Package2 className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Telugu Traditional</p>
                <p className="font-medium">Household Provisionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            {/* Quality Selector */}
            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
              {qualityTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedQuality(tier.id)}
                  className={`px-4 py-3 font-medium transition-colors ${
                    selectedQuality === tier.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-green-50'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode('box')}
                className={`p-3 transition-colors ${
                  viewMode === 'box'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-green-50'
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-green-50'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.name
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {category.name} ({category.item_count || 0})
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading traditional items...</p>
          </div>
        ) : (
          <>
            {viewMode === 'box' ? renderBoxView() : renderListView()}
            
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No items found</p>
              </div>
            )}
          </>
        )}

        {/* Total Amount Display - Always visible at bottom */}
        {selectedItems.size > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-green-500 shadow-2xl z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Package2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Provisional List</p>
                    <p className="font-semibold text-gray-900">{selectedItems.size} items selected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">₹{calculateTotalAmount().toFixed(2)}</p>
                  </div>
                  <button
                    onClick={addProvisionalListToCart}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}