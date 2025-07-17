import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';
import { ClockIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import toast from 'react-hot-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

export default function SubscriptionsPage() {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch real subscription plans from API
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const response = await fetch('/api/direct-data/subscription-plans');
        if (response.ok) {
          const plansData = await response.json();
          setSubscriptionPlans(plansData.data || []);
        } else {
          // Fallback to curated plans when API is not available
          setSubscriptionPlans([
            {
              id: 'weekly',
              name: 'Weekly Fresh Box',
              price: 399,
              originalPrice: 499,
              duration: 'per week',
              description: 'Perfect for small families. Fresh organic produce delivered weekly.',
              features: [
                '5-7 varieties of seasonal vegetables',
                '3-4 types of fresh fruits',
                'Free delivery within city',
                'Flexible pause/resume',
                '24/7 customer support',
              ],
              savings: 'Save ₹100 weekly',
            },
            {
              id: 'monthly',
              name: 'Monthly Wellness Plan',
              price: 1299,
              originalPrice: 1699,
              duration: 'per month',
              description: 'Complete nutrition for medium families with premium organic selection.',
              features: [
                '10-12 varieties of seasonal vegetables',
                '6-8 types of fresh fruits',
                '2 kg premium grains & pulses',
                'Free delivery & express options',
                'Nutrition consultation included',
                'Recipe suggestions & meal planning',
                'Priority customer support',
              ],
              popular: true,
              savings: 'Save ₹400 monthly',
            },
            {
              id: 'quarterly',
              name: 'Quarterly Family Pack',
              price: 3599,
              originalPrice: 4799,
              duration: 'per quarter',
              description:
                'Best value for large families. Comprehensive organic nutrition package.',
              features: [
                '15+ varieties of seasonal vegetables',
                '10+ types of fresh fruits',
                '5 kg premium grains & pulses',
                '2 kg organic dairy products',
                'Free delivery & same-day options',
                'Personal nutrition consultant',
                'Recipe books & cooking classes',
                'Family health tracking',
                'Dedicated account manager',
              ],
              savings: 'Save ₹1200 quarterly',
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
        setSubscriptionPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/direct-data/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          branchId: 'default',
          userId: 'guest',
        }),
      });

      if (response.ok) {
        toast.success('Subscription created successfully!');
      } else {
        toast.error('Please login to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Subscription Plans - Sri Venkateswara Organic Foods</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
          <Header />
          <div className="pt-24 pb-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading subscription plans...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Subscription Plans - Sri Venkateswara Organic Foods</title>
        <meta
          name="description"
          content="Choose from our organic subscription plans for regular delivery of fresh produce"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="pt-24 pb-16 px-4"
        >
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Fresh Organic Subscriptions
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Get regular deliveries of the freshest organic produce. Choose the plan that fits
                your family's needs.
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-green-600" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-green-600" />
                  <span>Flexible Scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  <span>100% Organic</span>
                </div>
              </div>
            </motion.div>

            {/* Subscription Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {subscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="relative"
                >
                  <GlassCard
                    className={`p-8 h-full flex flex-col ${plan.popular ? 'ring-2 ring-green-500' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <StarIcon className="w-4 h-4" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-4">{plan.description}</p>

                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                        <span className="text-gray-600">{plan.duration}</span>
                      </div>

                      {plan.originalPrice && (
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <span className="text-gray-500 line-through">₹{plan.originalPrice}</span>
                          <span className="text-green-600 font-semibold">{plan.savings}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 mb-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isProcessing && selectedPlan === plan.id}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        plan.popular
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isProcessing && selectedPlan === plan.id ? 'Processing...' : 'Subscribe Now'}
                    </button>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <Footer />
      </div>
    </>
  );
}
