import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { OrganizationHub } from '../components/business-domains';

export default function CompanyManagement() {
  return (
    <DashboardLayout
      title="Organization Hub"
      description="Company structure and team management"
      activeDomain="organization"
    >
      <OrganizationHub />
    </DashboardLayout>
  );
}
