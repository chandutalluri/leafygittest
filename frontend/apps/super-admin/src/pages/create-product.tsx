import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import CompositeProductForm from '../modules/products/CompositeProductForm';

export default function CreateProduct() {
  return (
    <DashboardLayout
      title="Create Product"
      description="Add new products to the catalog"
      activeDomain="products"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Unified Product Creation</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Create products with a single workflow that coordinates all five microservices: catalog
            management, inventory tracking, image handling, categorization, and label generation.
          </p>
        </div>
        <CompositeProductForm />
      </div>
    </DashboardLayout>
  );
}
