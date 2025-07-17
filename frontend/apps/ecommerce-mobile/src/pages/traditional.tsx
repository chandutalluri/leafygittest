import { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { useRouter } from 'next/router';
import { 
  Search, 
  Minus, 
  Plus, 
  ShoppingCart, 
  List, 
  Package2, 
  Clock, 
  CheckCircle2, 
  LayoutGrid,
  Zap,
  Award
} from 'lucide-react';
import { useAuthStore } from '../lib/stores/auth';
import { useBranchStore } from '../lib/stores/useBranchStore';
import { useCartStore } from '../lib/stores/useCartStore';
import { toast } from 'react-hot-toast';
import { TraditionalItem, Category, QualityTier } from '../types/traditional';

const qualityTiers: QualityTier[] = [
  { id: 'ordinary', label: 'Ordinary', description: 'Good value for money' },
  { id: 'medium', label: 'Medium', description: 'Better quality' },
  { id: 'best', label: 'Best', description: 'Premium quality' }
];

// Mobile-optimized quantity options for different product types
const getQuantityOptions = (category: string, unit: string) => {
  switch (category.toLowerCase()) {
    case 'spices':
      return [
        { value: 0.01, label: '10g' },
        { value: 0.05, label: '50g' },
        { value: 0.1, label: '100g' },
        { value: 0.25, label: '250g' },
        { value: 0.5, label: '500g' },
        { value: 1, label: '1kg' }
      ];
    case 'dry fruits':
      return [
        { value: 0.1, label: '100g' },
        { value: 0.25, label: '250g' },
        { value: 0.5, label: '500g' },
        { value: 1, label: '1kg' },
        { value: 2, label: '2kg' }
      ];
    case 'oils':
      if (unit === 'liter') {
        return [
          { value: 0.5, label: '500ml' },
          { value: 1, label: '1L' },
          { value: 2, label: '2L' },
          { value: 5, label: '5L' }
        ];
      }
      return [
        { value: 0.5, label: '500g' },
        { value: 1, label: '1kg' },
        { value: 2, label: '2kg' },
        { value: 5, label: '5kg' }
      ];
    default:
      return [
        { value: 0.5, label: '500g' },
        { value: 1, label: '1kg' },
        { value: 2, label: '2kg' },
        { value: 5, label: '5kg' },
        { value: 10, label: '10kg' }
      ];
  }
};

export default function TraditionalSupplies() {
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
  const [viewMode, setViewMode] = useState<'list' | 'box'>('list');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!selectedBranch) {
      router.push('/mobile');
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
        setQuantities(prevQty => ({
          ...prevQty,
          [itemId]: 0
        }));
      } else {
        newSet.add(itemId);
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
      description: selectedItemsList.join(', ')
    });

    toast.success(`Monthly provisional list added to cart! ₹${totalAmount.toFixed(2)} for ${itemCount} items`);
    setSelectedItems(new Set());
    setQuantities({});
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name_telugu?.includes(searchQuery)
  );

  const renderListView = () => (
    <div className="space-y-3">
      {selectedItems.size > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-800">{selectedItems.size} items selected</span>
            <button
              onClick={addProvisionalListToCart}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Add List
            </button>
          </div>
        </div>
      )}

      {filteredItems.map((item) => (
        <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => toggleItemSelection(item.id)}
              className={`flex-shrink-0 p-1 rounded-full mt-1 ${
                selectedItems.has(item.id) 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-green-600 text-xs">{item.name_telugu}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ₹{getPrice(item).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">per {item.unit}</p>
                </div>
              </div>

              {item.isAvailable ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-1">
                    {getQuantityOptions(item.category, item.unit).slice(0, 6).map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSpecificQuantity(item.id, option.value)}
                        className={`text-xs py-1 px-2 rounded ${
                          quantities[item.id] === option.value
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -0.1)}
                        className="p-1"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium min-w-[50px] text-center">
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
                      className="bg-green-600 text-white py-1 px-3 rounded text-sm flex items-center gap-1"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 text-sm py-2">Out of Stock</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBoxView = () => (
    <div className="grid grid-cols-2 gap-3">
      {filteredItems.map((item) => (
        <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm leading-tight">{item.name}</h3>
              <p className="text-green-600 text-xs">{item.name_telugu}</p>
            </div>
            <button
              onClick={() => toggleItemSelection(item.id)}
              className={`flex-shrink-0 p-1 rounded-full ml-2 ${
                selectedItems.has(item.id) 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
            </button>
          </div>

          <div className="mb-3">
            <p className="text-lg font-bold text-green-600">
              ₹{getPrice(item).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">per {item.unit}</p>
          </div>

          {item.isAvailable ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                {getQuantityOptions(item.category, item.unit).slice(0, 3).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSpecificQuantity(item.id, option.value)}
                    className={`text-xs py-1 px-1 rounded ${
                      quantities[item.id] === option.value
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, -0.1)}
                    className="p-1"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-medium min-w-[30px] text-center">
                    {quantities[item.id] || 0}
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
                  className="bg-green-600 text-white py-1 px-2 rounded text-xs flex items-center gap-1"
                >
                  <ShoppingCart className="h-3 w-3" />
                  Add
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-xs py-2">Out of Stock</p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Hero */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold">Traditional Home Supplies</h1>
              <p className="text-green-100 text-sm">Order daily essentials</p>
            </div>
            <div className="text-center">
              <Package2 className="h-6 w-6 mx-auto mb-1" />
              <p className="text-xs">Telugu Traditional</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-green-700 px-2 py-1 rounded text-xs">
              <Clock className="h-3 w-3" />
              <span>2-Min Order</span>
            </div>
            <div className="flex items-center gap-1 bg-green-700 px-2 py-1 rounded text-xs">
              <Zap className="h-3 w-3" />
              <span>Bulk Orders</span>
            </div>
            <div className="flex items-center gap-1 bg-green-700 px-2 py-1 rounded text-xs">
              <Award className="h-3 w-3" />
              <span>3 Quality Tiers</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {/* Quality Selector */}
            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden flex-1">
              {qualityTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedQuality(tier.id)}
                  className={`px-3 py-2 text-sm font-medium transition-colors flex-1 ${
                    selectedQuality === tier.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600'
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
                className={`p-2 ${
                  viewMode === 'box'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category.name
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <p className="mt-2 text-gray-600 text-sm">Loading...</p>
            </div>
          ) : (
            <>
              {viewMode === 'box' ? renderBoxView() : renderListView()}
              
              {filteredItems.length === 0 && (
                <div className="text-center py-8">
                  <Package2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No items found</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Total Amount Display - Fixed at bottom */}
        {selectedItems.size > 0 && (
          <div className="fixed bottom-16 left-0 right-0 bg-white border-t-2 border-green-500 shadow-2xl z-50 mx-4 mb-4 rounded-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-600">Monthly Provisional List</p>
                  <p className="font-semibold text-gray-900">{selectedItems.size} items selected</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Total Amount</p>
                  <p className="text-xl font-bold text-green-600">₹{calculateTotalAmount().toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={addProvisionalListToCart}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Add Entire List to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}