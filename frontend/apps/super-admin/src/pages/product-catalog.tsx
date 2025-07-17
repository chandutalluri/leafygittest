import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import ProductCRUD from '../components/business-domains/ProductCRUD';

export default function ProductCatalog() {
  return (
    <DashboardLayout 
      title="Product Catalog" 
      description="Manage product catalog and inventory"
      activeDomain="products"
    >
      <ProductCRUD />
    </DashboardLayout>
  );
}