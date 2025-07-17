import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import { BranchSelector } from '@/components/branch/BranchSelector';
import GlassCard from '@/components/ui/GlassCard';

export default function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isBranchSelectorOpen, setIsBranchSelectorOpen] = useState(false);
  const { user } = useAuthStore();
  const { selectedBranch, fetchBranches, detectLocation, branches } = useBranchStore();
  const router = useRouter();

  // Initialize component data - run only once
  useEffect(() => {
    const initializeLogin = async () => {
      try {
        // Load saved credentials if remember me was checked
        const savedEmail = localStorage.getItem('leafy_remembered_email');
        const savedRemember = localStorage.getItem('leafy_remember_me') === 'true';

        if (savedEmail && savedRemember) {
          setEmail(savedEmail);
          setRememberMe(true);
        } else {
          // Pre-fill demo credentials for easier testing
          setEmail('customer@leafyhealth.com');
          setPassword('password123');
        }

        // Automatically detect user location and load nearest branches
        try {
          await detectLocation();
        } catch (error) {
          console.log('Location detection failed, loading all branches');
          await fetchBranches();
        }
      } catch (error) {
        console.error('Login initialization error:', error);
      }
    };

    initializeLogin();
  }, []); // Empty dependency - run only once

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      const returnUrl = (router.query.returnUrl as string) || '/customer';
      router.push(returnUrl);
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Customer login attempt for:', email);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          branchId: selectedBranch?.id, // Include branch context
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Login successful:', result);

        // Use auth store to set authentication state
        const authStore = useAuthStore.getState();
        authStore.setUser(result.user);
        authStore.setToken(result.token);
        authStore.setAuthenticated(true);

        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('leafy_remembered_email', email);
          localStorage.setItem('leafy_remember_me', 'true');
        } else {
          localStorage.removeItem('leafy_remembered_email');
          localStorage.removeItem('leafy_remember_me');
        }

        // Redirect to the page they were trying to access, or account page
        const returnUrl = (router.query.returnUrl as string) || '/account';

        console.log('Redirecting to:', returnUrl);
        router.push(returnUrl);
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Customer Login - LeafyHealth</title>
        <meta
          name="description"
          content="Sign in to your LeafyHealth account for organic grocery delivery"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to continue your organic shopping journey</p>

              {/* Branch Location Info */}
              {selectedBranch && (
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span>Shopping from {selectedBranch.name}</span>
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Branch Selection */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setIsBranchSelectorOpen(true)}
                className="w-full p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-800 text-sm font-medium mb-1">
                      {selectedBranch ? 'Selected Branch:' : 'Select Your Branch'}
                    </p>
                    {selectedBranch ? (
                      <div className="text-green-700 text-xs space-y-1">
                        <div className="font-medium">{selectedBranch.name}</div>
                        <div>
                          {selectedBranch.city}, {selectedBranch.state}
                        </div>
                      </div>
                    ) : (
                      <div className="text-green-600 text-xs">
                        Choose your nearest branch for delivery
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-green-600">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                </div>
              </button>
            </div>

            {/* Demo Credentials Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm font-medium mb-2">Demo Login Credentials:</p>
              <div className="text-blue-700 text-xs space-y-1">
                <div>Email: customer@leafyhealth.com</div>
                <div>Password: password123</div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 transition-colors"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Forgot password?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to LeafyHealth?</span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center w-full px-4 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  Create Account
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href="/customer"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Continue as guest
                </Link>
              </div>
            </div>
          </GlassCard>

          {/* Branch Selection Link */}
          {!selectedBranch && branches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-center"
            >
              <Link href="/customer" className="text-sm text-green-600 hover:text-green-700">
                Select your delivery location first
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Branch Selector Modal */}
      <BranchSelector
        isOpen={isBranchSelectorOpen}
        onClose={() => setIsBranchSelectorOpen(false)}
        onSelect={branch => {
          console.log('Branch selected:', branch);
          setIsBranchSelectorOpen(false);
        }}
      />
    </>
  );
}
