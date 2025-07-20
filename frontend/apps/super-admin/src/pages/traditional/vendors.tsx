import { useState, useEffect } from 'react';
import Head from 'next/head';
// import Layout from '../../components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Star, Package, DollarSign, TrendingUp, Edit, Plus, MapPin } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Vendor {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  quality_tiers: string[];
  rating: number;
  total_orders: number;
  total_revenue: number;
  is_active: boolean;
}

export default function TraditionalVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    quality_tiers: [] as string[],
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get('/api/traditional/vendors');
      setVendors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingVendor) {
        await axios.put(`/api/traditional/vendors/${editingVendor.id}`, formData);
        toast.success('Vendor updated successfully');
      } else {
        await axios.post('/api/traditional/vendors', formData);
        toast.success('Vendor added successfully');
      }

      fetchVendors();
      resetForm();
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast.error('Failed to save vendor');
    }
  };

  const toggleVendorStatus = async (vendor: Vendor) => {
    try {
      await axios.patch(`/api/traditional/vendors/${vendor.id}/status`, {
        is_active: !vendor.is_active,
      });
      toast.success(`Vendor ${vendor.is_active ? 'deactivated' : 'activated'}`);
      fetchVendors();
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast.error('Failed to update vendor status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      quality_tiers: [],
    });
    setEditingVendor(null);
    setShowAddModal(false);
  };

  const startEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      contact_person: vendor.contact_person,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
      quality_tiers: vendor.quality_tiers,
    });
    setShowAddModal(true);
  };

  const getQualityTierDisplay = (tier: string) => {
    switch (tier) {
      case 'ordinary':
        return '₹';
      case 'medium':
        return '₹₹';
      case 'best':
        return '₹₹₹';
      default:
        return tier;
    }
  };

  return (
    <div className="p-4">
      <Head>
        <title>Traditional Vendors Management - Super Admin</title>
      </Head>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Traditional Vendors</h1>
            <p className="text-gray-600 mt-2">Manage vendors for traditional home supplies</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {/* Vendors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          </div>
        ) : vendors.length === 0 ? (
          <Card className="p-12 text-center">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No vendors found</p>
            <Button onClick={() => setShowAddModal(true)} className="mt-4">
              Add First Vendor
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map(vendor => (
              <Card key={vendor.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.contact_person}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      vendor.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {vendor.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{vendor.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Quality Tiers:</span>
                    <div className="flex gap-1">
                      {vendor.quality_tiers.map(tier => (
                        <span key={tier} className="font-semibold text-emerald-600">
                          {getQualityTierDisplay(tier)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-gray-50 rounded p-2">
                    <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Rating</p>
                    <p className="font-semibold">{vendor.rating.toFixed(1)}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <Package className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Orders</p>
                    <p className="font-semibold">{vendor.total_orders}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <DollarSign className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Revenue</p>
                    <p className="font-semibold">₹{(vendor.total_revenue || 0).toFixed(0)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(vendor)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={vendor.is_active ? 'outline' : 'default'}
                    onClick={() => toggleVendorStatus(vendor)}
                    className="flex-1"
                  >
                    {vendor.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Vendor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quality Tiers</label>
                  <div className="flex gap-3">
                    {['ordinary', 'medium', 'best'].map(tier => (
                      <label key={tier} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.quality_tiers.includes(tier)}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                quality_tiers: [...formData.quality_tiers, tier],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                quality_tiers: formData.quality_tiers.filter(t => t !== tier),
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="capitalize">{tier}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    {editingVendor ? 'Update' : 'Add'} Vendor
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
