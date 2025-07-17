import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  phone: string;
  openingTime: string;
  closingTime: string;
  isActive: boolean;
  companyId: number;
  companyName?: string;
}

interface BranchStore {
  selectedBranch: Branch | null;
  nearbyBranches: Branch[];
  allBranches: Branch[];
  loading: boolean;
  error: string | null;

  setSelectedBranch: (branch: Branch) => void;
  setNearbyBranches: (branches: Branch[]) => void;
  setAllBranches: (branches: Branch[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility methods
  getNearestBranch: (latitude: number, longitude: number) => Branch | null;
  autoSelectBranch: (latitude: number, longitude: number) => void;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useBranchStore = create<BranchStore>()(
  persist(
    (set, get) => ({
      selectedBranch: null,
      nearbyBranches: [],
      allBranches: [],
      loading: false,
      error: null,

      setSelectedBranch: branch => set({ selectedBranch: branch }),
      setNearbyBranches: branches => set({ nearbyBranches: branches }),
      setAllBranches: branches => set({ allBranches: branches }),
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),

      getNearestBranch: (latitude, longitude) => {
        const branches = get().allBranches.filter(b => b.isActive);
        if (branches.length === 0) return null;

        let nearest = branches[0];
        let minDistance = calculateDistance(
          latitude,
          longitude,
          nearest.latitude,
          nearest.longitude
        );

        branches.forEach(branch => {
          const distance = calculateDistance(
            latitude,
            longitude,
            branch.latitude,
            branch.longitude
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearest = branch;
          }
        });

        return nearest;
      },

      autoSelectBranch: (latitude, longitude) => {
        const nearest = get().getNearestBranch(latitude, longitude);
        if (nearest && !get().selectedBranch) {
          set({ selectedBranch: nearest });
        }
      },
    }),
    {
      name: 'branch-storage',
      partialize: state => ({ selectedBranch: state.selectedBranch }),
    }
  )
);
