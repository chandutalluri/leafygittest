import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { FinancialControlCenter } from '../components/business-domains';

export default function AccountingManagement() {
  return (
    <DashboardLayout
      title="Financial Control"
      description="Comprehensive financial oversight"
      activeDomain="financial"
    >
      <FinancialControlCenter />
    </DashboardLayout>
  );
}
