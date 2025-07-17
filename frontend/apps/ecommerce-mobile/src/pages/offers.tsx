import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MobileLayout from '../components/layout/MobileLayout';
import { useQuery } from '@tanstack/react-query';
import { Gift, Clock, Percent } from 'lucide-react';

export default function OffersPage() {
  const router = useRouter();

  // Fetch active promotions from database
  const { data: promotionsResponse, isLoading } = useQuery({
    queryKey: ['/api/direct-data/promotions'],
    queryFn: async () => {
      const response = await fetch('/api/direct-data/promotions');
      if (!response.ok) throw new Error('Failed to fetch promotions');
      return response.json();
    },
  });

  const promotions = promotionsResponse?.data || [];

  return (
    <>
      <Head>
        <title>Offers - LeafyHealth</title>
        <meta name="description" content="Special offers and discounts on organic groceries" />
      </Head>

      <MobileLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="px-4 py-4">
              <h1 className="text-xl font-bold text-gray-900">Special Offers</h1>
              <p className="text-sm text-gray-600 mt-1">Save on your favorite organic products</p>
            </div>
          </div>

          {/* Offers List */}
          <div className="px-4 py-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : promotions.length > 0 ? (
              <div className="space-y-3">
                {promotions.map((promo: any) => (
                  <div
                    key={promo.id}
                    className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        {promo.type === 'percentage' ? (
                          <Percent className="h-6 w-6 text-green-600" />
                        ) : (
                          <Gift className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{promo.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{promo.description}</p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                              {promo.code}
                            </span>
                            <span className="text-green-600 font-semibold">
                              {promo.discount}% OFF
                            </span>
                          </div>

                          {promo.valid_until && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                Valid till {new Date(promo.valid_until).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {promo.min_order_amount && (
                          <p className="text-xs text-gray-500 mt-2">
                            Min order: ₹{promo.min_order_amount}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Offers</h3>
                <p className="text-sm text-gray-600">Check back soon for exciting deals!</p>
              </div>
            )}
          </div>
        </div>
      </MobileLayout>
    </>
  );
}
