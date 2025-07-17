import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { BusinessIntelligenceCenter } from '../components/business-domains';

export default function AnalyticsReporting() {
  return (
    <DashboardLayout 
      title="Business Intelligence" 
      description="Analytics and performance insights"
      activeDomain="intelligence"
    >
      <BusinessIntelligenceCenter />
    </DashboardLayout>
  );
}