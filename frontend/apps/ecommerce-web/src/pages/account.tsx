import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  UserIcon,
  MapPinIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { useBranchStore } from '../lib/stores/useBranchStore';
import Header from '../components/layout/Header';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?returnUrl=/account');
      return;
    }

    // Load user addresses
    loadAddresses();
  }, [isAuthenticated, router]);

  const loadAddresses = async () => {
    try {
      // In a real app, this would be an API call
      // For now, load from localStorage
      const savedAddresses = localStorage.getItem('user_addresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/customer');
  };

  const saveAddress = (address: Address) => {
    const updatedAddresses = editingAddress
      ? addresses.map(a => (a.id === editingAddress ? address : a))
      : [...addresses, { ...address, id: Date.now().toString() }];

    setAddresses(updatedAddresses);
    localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
    toast.success(editingAddress ? 'Address updated!' : 'Address added!');
    setIsAddingAddress(false);
    setEditingAddress(null);
  };

  const deleteAddress = (id: string) => {
    const updatedAddresses = addresses.filter(a => a.id !== id);
    setAddresses(updatedAddresses);
    localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
    toast.success('Address deleted!');
  };

  const setDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updatedAddresses);
    localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
    toast.success('Default address updated!');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBagIcon },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
    { id: 'payments', label: 'Payment Methods', icon: CreditCardIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/customer')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                {/* User Info */}
                <div className="text-center mb-6 pb-6 border-b">
                  <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{user.name || user.email}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {selectedBranch && (
                    <p className="text-xs text-green-600 mt-2">{selectedBranch.name} Branch</p>
                  )}
                </div>

                {/* Menu */}
                <nav className="space-y-1">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow">
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.name || ''}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          disabled
                          className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Delivery Addresses</h2>
                      <button
                        onClick={() => setIsAddingAddress(true)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Address</span>
                      </button>
                    </div>

                    {isAddingAddress || editingAddress ? (
                      <AddressForm
                        address={
                          editingAddress ? addresses.find(a => a.id === editingAddress) : undefined
                        }
                        onSave={saveAddress}
                        onCancel={() => {
                          setIsAddingAddress(false);
                          setEditingAddress(null);
                        }}
                      />
                    ) : (
                      <div className="space-y-4">
                        {addresses.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">
                            No addresses saved. Add your first delivery address.
                          </p>
                        ) : (
                          addresses.map(address => (
                            <AddressCard
                              key={address.id}
                              address={address}
                              onEdit={() => setEditingAddress(address.id)}
                              onDelete={() => deleteAddress(address.id)}
                              onSetDefault={() => setDefaultAddress(address.id)}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Order History</h2>
                    <div className="text-center py-12">
                      <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No orders yet</p>
                      <button
                        onClick={() => router.push('/products')}
                        className="mt-4 text-green-600 hover:text-green-700"
                      >
                        Start Shopping
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>
                    <div className="text-center py-12">
                      <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Your wishlist is empty</p>
                    </div>
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                    <p className="text-gray-500">No payment methods saved</p>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                      {['Order Updates', 'Promotional Emails', 'SMS Notifications'].map(item => (
                        <label key={item} className="flex items-center justify-between">
                          <span className="text-gray-700">{item}</span>
                          <input type="checkbox" className="form-checkbox text-green-600" />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                    <button className="text-green-600 hover:text-green-700">Change Password</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Address Form Component
function AddressForm({
  address,
  onSave,
  onCancel,
}: {
  address?: Address;
  onSave: (address: Address) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Address>>(
    address || {
      type: 'home',
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: 'Andhra Pradesh',
      pincode: '',
      isDefault: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Address);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
        <select
          value={formData.type}
          onChange={e =>
            setFormData({ ...formData, type: e.target.value as 'home' | 'work' | 'other' })
          }
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="home">Home</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
        <input
          type="text"
          required
          value={formData.addressLine1}
          onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          value={formData.addressLine2}
          onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            type="text"
            required
            value={formData.state}
            onChange={e => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            required
            pattern="[0-9]{6}"
            value={formData.pincode}
            onChange={e => setFormData({ ...formData, pincode: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="default"
          checked={formData.isDefault}
          onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
          className="form-checkbox text-green-600"
        />
        <label htmlFor="default" className="ml-2 text-sm text-gray-700">
          Set as default address
        </label>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Address Card Component
function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  return (
    <div
      className={`border rounded-lg p-4 ${address.isDefault ? 'border-green-500' : 'border-gray-200'}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold">{address.name}</span>
            <span className="px-2 py-1 bg-gray-100 text-xs rounded-full capitalize">
              {address.type}
            </span>
            {address.isDefault && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Default
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">
            {address.addressLine1}
            {address.addressLine2 && <>, {address.addressLine2}</>}
          </p>
          <p className="text-gray-600 text-sm">
            {address.city}, {address.state} - {address.pincode}
          </p>
          <p className="text-gray-600 text-sm mt-1">Phone: {address.phone}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="text-gray-500 hover:text-gray-700">
            <PencilIcon className="w-5 h-5" />
          </button>
          <button onClick={onDelete} className="text-red-500 hover:text-red-700">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      {!address.isDefault && (
        <button onClick={onSetDefault} className="mt-3 text-sm text-green-600 hover:text-green-700">
          Set as default
        </button>
      )}
    </div>
  );
}
