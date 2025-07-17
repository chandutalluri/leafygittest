import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { useCartStore } from '@/lib/stores/useCartStore';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  return (
    <MobileLayout>
      <Head>
        <title>Cart - LeafyHealth</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button onClick={() => router.back()}>
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold ml-4">My Cart</h1>
            </div>
            <span className="text-sm text-gray-600">
              {isHydrated ? `${getTotalItems()} ${getTotalItems() === 1 ? 'item' : 'items'}` : ''}
            </span>
          </div>
        </div>

        <div className="p-4">
          {!isHydrated ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some organic products to get started</p>
              <Button
                onClick={() => router.push('/')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={item.image || '/images/default-product.jpg'}
                        alt={item.name}
                        className="w-15 h-15 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/default-product.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                        {item.name_telugu && (
                          <p className="text-sm text-gray-500 truncate">{item.name_telugu}</p>
                        )}
                        <p className="text-emerald-600 font-bold">
                          ₹{item.price.toFixed(2)}/{item.unit || 'unit'}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium text-lg px-3">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.maxQuantity && item.quantity >= item.maxQuantity}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <Card className="p-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({isHydrated ? getTotalItems() : 0} items)</span>
                    <span>₹{isHydrated ? getTotalPrice().toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{isHydrated ? getTotalPrice().toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </Card>

              {/* Checkout Button */}
              <div className="mt-6">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-medium"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}