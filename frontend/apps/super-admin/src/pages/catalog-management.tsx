import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProductEcosystemHub } from '../components/business-domains';

export default function CatalogManagement() {
  return (
    <DashboardLayout
      title="Product Ecosystem"
      description="Complete product lifecycle management"
      activeDomain="products"
    >
      <ProductEcosystemHub />
    </DashboardLayout>
  );
}
