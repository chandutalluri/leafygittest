import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBranchStore, Branch } from '@/lib/stores/useBranchStore';
import { MapPinIcon, ClockIcon, TruckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface BranchSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (branch: Branch) => void;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const {
    branches,
    selectedBranch,
    userLocation,
    isLoadingLocation,
    detectLocation,
    fetchBranches,
    calculateDistance,
    setSelectedBranch,
  } = useBranchStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchBranches();
    }
  }, [isOpen, fetchBranches]);

  useEffect(() => {
    const filtered = branches.filter(
      branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by distance if user location is available
    if (userLocation) {
      filtered.sort((a, b) => {
        const distanceA = calculateDistance(a) || Infinity;
        const distanceB = calculateDistance(b) || Infinity;
        return distanceA - distanceB;
      });
    }

    setFilteredBranches(filtered);
  }, [branches, searchTerm, userLocation, calculateDistance]);

  const handleLocationDetection = async () => {
    try {
      await detectLocation();
    } catch (error) {
      console.error('Failed to detect location:', error);
    }
  };

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    onSelect(branch);
    onClose();
  };

  const formatDistance = (branch: Branch) => {
    const distance = calculateDistance(branch);
    if (distance === null) return '';
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Select Your Branch</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>

              {/* Location Detection */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={handleLocationDetection}
                  disabled={isLoadingLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MapPinIcon className="w-4 h-4" />
                  {isLoadingLocation ? 'Detecting...' : 'Use My Location'}
                </button>

                {userLocation && (
                  <span className="text-sm text-green-600 font-medium">
                    📍 Location detected - showing nearest branches
                  </span>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by branch name, city, or area..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Branch List */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {filteredBranches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No branches found matching your search.' : 'Loading branches...'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBranches.map(branch => (
                    <motion.div
                      key={branch.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBranchSelect(branch)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedBranch?.id === branch.id
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                            {userLocation && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {formatDistance(branch)} away
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <MapPinIcon className="w-4 h-4" />
                            <span>
                              {branch.address}, {branch.city}, {branch.state}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {branch.workingHours && (
                              <div className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                <span>
                                  {branch.workingHours.isOpen24Hours
                                    ? '24 Hours'
                                    : `${branch.workingHours.open} - ${branch.workingHours.close}`}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <TruckIcon className="w-4 h-4" />
                              <span>{branch.deliveryRadius}km delivery</span>
                            </div>
                          </div>

                          {branch.features && branch.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {branch.features.slice(0, 3).map((feature, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {selectedBranch?.id === branch.id && (
                          <div className="ml-4">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {filteredBranches.length} branch{filteredBranches.length !== 1 ? 'es' : ''}{' '}
                  available
                </p>

                {selectedBranch && (
                  <button
                    onClick={() => handleBranchSelect(selectedBranch)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Continue with {selectedBranch.name}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
