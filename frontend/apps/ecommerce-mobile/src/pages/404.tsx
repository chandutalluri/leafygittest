import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import MobileLayout from '@/components/layout/MobileLayout';
import GlassCard from '@/components/ui/GlassCard';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - LeafyHealth</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Head>

      <MobileLayout>
        <div className="px-4 py-6 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, duration: 0.6 }}
                className="text-8xl mb-6"
              >
                🔍
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl font-bold text-gray-800 mb-4"
              >
                404
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl font-semibold text-gray-700 mb-4"
              >
                Page Not Found
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-gray-600 mb-8"
              >
                Sorry, the page you're looking for doesn't exist. It might have been moved, deleted,
                or you entered the wrong URL.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="space-y-3"
              >
                <Link
                  href="/"
                  className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Go Home</span>
                </Link>

                <Link
                  href="/products"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span>Browse Products</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-8 pt-6 border-t border-gray-200"
              >
                <p className="text-sm text-gray-500 mb-4">
                  Quick links to help you find what you're looking for:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Link
                    href="/categories"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/cart"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    Shopping Cart
                  </Link>
                  <Link
                    href="/account"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/contact"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </MobileLayout>
    </>
  );
}
