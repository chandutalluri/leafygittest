import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BranchSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export default function BranchSelectorModal({
  isOpen,
  onClose,
  isMobile = false,
}: BranchSelectorModalProps) {
  const { branches, selectedBranch, setSelectedBranch } = useBranchStore();

  const handleSelectBranch = (branch: any) => {
    setSelectedBranch(branch);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('sm:max-w-[425px]', isMobile && 'w-[90%]')}>
        <DialogHeader>
          <DialogTitle>Select Delivery Location</DialogTitle>
          <DialogDescription>Choose your nearest branch for delivery</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          {branches.map(branch => (
            <button
              key={branch.id}
              onClick={() => handleSelectBranch(branch)}
              className={cn(
                'w-full text-left p-4 rounded-lg border transition-colors',
                selectedBranch?.id === branch.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-50'
              )}
            >
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{branch.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{branch.address}</p>
                  <p className="text-sm text-gray-500">
                    {branch.city}, {branch.state} - {branch.postalCode}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">📞 {branch.phone}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
