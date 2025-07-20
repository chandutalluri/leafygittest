import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { InventoryManagementCenter } from '../components/inventory/InventoryManagementCenter';

export default function InventoryManagement() {
  return (
    <DashboardLayout
      title="Inventory Management"
      description="Stock and inventory control"
      activeDomain="products"
    >
      <InventoryManagementCenter />
    </DashboardLayout>
  );
}
