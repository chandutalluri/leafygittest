import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { CustomerRelationshipHub } from '../components/business-domains';

export default function CustomerService() {
  return (
    <DashboardLayout 
      title="Customer Relations" 
      description="Complete customer lifecycle management"
      activeDomain="customers"
    >
      <CustomerRelationshipHub />
    </DashboardLayout>
  );
}