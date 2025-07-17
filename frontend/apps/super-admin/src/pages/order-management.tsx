import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { OrderOperationsCenter } from '../components/business-domains';

export default function OrderManagement() {
  return (
    <DashboardLayout 
      title="Order Operations" 
      description="End-to-end order processing and fulfillment"
      activeDomain="orders"
    >
      <OrderOperationsCenter />
    </DashboardLayout>
  );
}