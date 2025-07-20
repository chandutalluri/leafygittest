/**
 * Category Management Component
 * Complete category lifecycle management
 */

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import {
  TagIcon,
  PlusIcon,
  PencilIcon as EditIcon,
  TrashIcon,
  FolderIcon,
  MagnifyingGlassIcon as SearchIcon,
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
  product_count?: number;
  created_at: string;
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parent_id: null as number | null,
  });
  const { token } = useAuthStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Categories data received:', data);
        setCategories(data.data || data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = [...categories];

    if (searchTerm) {
      filtered = filtered.filter(
        category =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  };

  const handleCreateCategory = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(prev => [...prev, data.category]);
        setNewCategory({ name: '', description: '', parent_id: null });
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/direct-data/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TagIcon className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
            <p className="text-sm text-gray-600">Organize your products into categories</p>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl rounded-lg border">
        <div className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Create Category Form */}
      {isCreating && (
        <div className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Create New Category</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={e => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Organic Rice"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newCategory.description}
                onChange={e => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Category description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                value={newCategory.parent_id || ''}
                onChange={e =>
                  setNewCategory(prev => ({
                    ...prev,
                    parent_id: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">No Parent (Top Level)</option>
                {categories
                  .filter(cat => !cat.parent_id)
                  .map((category, index) => (
                    <option
                      key={`select-${category.id}-${category.name}-${index}`}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateCategory}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Category
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewCategory({ name: '', description: '', parent_id: null });
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <div
            key={`category-${category.id}-${category.name}-${index}`}
            className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg border"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <FolderIcon className="h-6 w-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500">ID: {category.id}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <div className="space-y-3">
                {category.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Products: {category.product_count || 0}</span>
                  <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    onClick={() => setEditingCategory(category)}
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="flex-1 px-3 py-2 text-sm bg-red-600 text-white border border-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms.'
              : 'Get started by creating your first category.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Category</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
