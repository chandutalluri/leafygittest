import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import ImageManagementHub from '../components/image-management/ImageManagementHub';

export default function ImageManagement() {
  return (
    <DashboardLayout 
      title="Image Management" 
      description="Central image repository"
      activeDomain="products"
    >
      <ImageManagementHub />
    </DashboardLayout>
  );
}