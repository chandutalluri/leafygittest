import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { CategoryManagement } from '../modules/products/CategoryManagement';

export default function Categories() {
  return (
    <DashboardLayout 
      title="Categories" 
      description="Product categories management"
      activeDomain="products"
    >
      <CategoryManagement />
    </DashboardLayout>
  );
}