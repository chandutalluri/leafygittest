import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StreamlinedLabelDesign } from '../components/label-design/StreamlinedLabelDesign';

export default function LabelDesign() {
  return (
    <DashboardLayout
      title="Label Design"
      description="Professional label design system"
      activeDomain="products"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Professional Label Design System</h3>
            <p className="text-sm text-gray-500">
              Industrial-grade multi-user label design and printing system with enhanced QR code
              generation
            </p>
          </div>
        </div>

        {/* Streamlined Label Design System */}
        <div>
          <StreamlinedLabelDesign />
        </div>
      </div>
    </DashboardLayout>
  );
}
