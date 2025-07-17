import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { apiClient } from '@/lib/api';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import { useCartStore } from '@/lib/stores/useCartStore';
import MobileLayout from '@/components/layout/MobileLayout';
import GlassCard from '@/components/ui/GlassCard';
import BranchSelectorModal from '../../components/modals/BranchSelectorModal';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { selectedBranch } = useBranchStore();
  const { addItem } = useCartStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        return await apiClient.getProduct(id as string);
      } catch (error) {
        return null;
      }
    },
    enabled: !!id,
    retry: false,
  });

  const handleAddToCart = () => {
    if (!selectedBranch) {
      toast.error('Please select a delivery location first');
      return;
    }

    if (!(product as any)?.data) {
      toast.error('Product not available');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: (product as any).data.id,
        name: (product as any).data.name,
        price: (product as any).data.price,
        image: (product as any).data.images?.[0] || '',
        category: (product as any).data.category,
        branchId: selectedBranch.id,
        maxQuantity: (product as any).data.stockQuantity,
      });
    }

    toast.success(`${quantity} × ${(product as any).data.name} added to cart!`);
  };

  // Wishlist functionality removed - feature consolidated

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: (product as any)?.data?.name,
        text: (product as any)?.data?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading Product - LeafyHealth</title>
        </Head>
        <MobileLayout>
          <div className="px-4 py-6">
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </MobileLayout>
      </>
    );
  }

  if (!(product as any)?.data) {
    return (
      <>
        <Head>
          <title>Product Not Found - LeafyHealth</title>
        </Head>
        <MobileLayout>
          <div className="px-4 py-6 text-center">
            <GlassCard className="p-8">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h2>
              <p className="text-gray-600 mb-6 text-sm">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/products">
                <motion.button
                  className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Products
                </motion.button>
              </Link>
            </GlassCard>
          </div>
        </MobileLayout>
      </>
    );
  }

  const productData = (product as any)?.data;
  const images = productData.images || [];

  return (
    <>
      <Head>
        <title>{productData.name} - LeafyHealth</title>
        <meta name="description" content={productData.description} />
      </Head>

      <MobileLayout>
        <BranchSelectorModal />

        <div className="px-4 py-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Products</span>
            </Link>
          </motion.div>

          <div className="space-y-6">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-4">
                <div className="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden">
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage]}
                      alt={productData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                      🥕
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-green-500' : 'border-gray-200'
                        }`}
                      >
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <GlassCard className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 flex-1">{productData.name}</h1>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={handleWishlist}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {isWishlisted ? (
                        <HeartIconSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(productData.price)}
                  </span>
                  {productData.originalPrice && productData.originalPrice > productData.price && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(productData.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < (productData.rating || 4.5)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({productData.reviewCount || 0} reviews)
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {productData.description ||
                      'Fresh, organic produce delivered straight from our certified farms.'}
                  </p>
                </div>
              </GlassCard>

              {/* Quantity Selector */}
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Quantity</h3>
                    <p className="text-sm text-gray-600">
                      {productData.stockQuantity || 0} available
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="text-xl font-semibold min-w-8 text-center">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(productData.stockQuantity || 99, quantity + 1))
                      }
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  className="w-full bg-green-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>Add to Cart • {formatPrice(productData.price * quantity)}</span>
                </motion.button>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </MobileLayout>
    </>
  );
}
