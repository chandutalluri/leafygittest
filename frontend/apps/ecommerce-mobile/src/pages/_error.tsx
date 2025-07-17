import { NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import MobileLayout from '@/components/layout/MobileLayout';
import GlassCard from '@/components/ui/GlassCard';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  const getErrorMessage = () => {
    if (statusCode === 404) {
      return "The page you're looking for doesn't exist.";
    }
    if (statusCode === 500) {
      return 'A server error occurred. Our team has been notified.';
    }
    if (statusCode === 403) {
      return "You don't have permission to access this page.";
    }
    return statusCode ? `A ${statusCode} error occurred on server` : 'An error occurred on client';
  };

  const getErrorTitle = () => {
    if (statusCode === 404) return 'Page Not Found';
    if (statusCode === 500) return 'Server Error';
    if (statusCode === 403) return 'Access Forbidden';
    return 'Oops! Something went wrong';
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>{`${statusCode || 'Error'} - LeafyHealth`}</title>
        <meta name="description" content="An error occurred while loading the page" />
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
                className="flex justify-center mb-6"
              >
                <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />
              </motion.div>

              {statusCode && (
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-4xl font-bold text-gray-800 mb-4"
                >
                  {statusCode}
                </motion.h1>
              )}

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl font-semibold text-gray-700 mb-4"
              >
                {getErrorTitle()}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-gray-600 mb-8"
              >
                {getErrorMessage()}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-3"
              >
                <button
                  onClick={handleRefresh}
                  className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  <span>Try Again</span>
                </button>

                <Link
                  href="/"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors block text-center"
                >
                  Go Home
                </Link>
              </motion.div>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && err && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Development Details:</h3>
                  <pre className="text-xs text-left text-red-600 bg-red-50 p-3 rounded-lg overflow-auto max-h-32">
                    {err.message}
                    {err.stack && '\n\n' + err.stack}
                  </pre>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-6 pt-4 border-t border-gray-200"
              >
                <p className="text-xs text-gray-500">
                  If this problem persists, please{' '}
                  <Link
                    href="/contact"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    contact our support team
                  </Link>
                  .
                </p>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </MobileLayout>
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
