import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  deliveryRadius: number;
  workingHours?: {
    open: string;
    close: string;
    isOpen24Hours: boolean;
  };
  features?: string[];
  deliveryFee?: number;
}

interface BranchStore {
  selectedBranch: Branch | null;
  branches: Branch[];
  userLocation: { latitude: number; longitude: number } | null;
  isLoadingLocation: boolean;
  error: string | null;

  // Actions
  setSelectedBranch: (branch: Branch) => void;
  setBranches: (branches: Branch[]) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  setLoadingLocation: (loading: boolean) => void;
  detectLocation: () => Promise<void>;
  fetchBranches: () => Promise<void>;
  fetchNearbyBranches: (lat: number, lng: number) => Promise<Branch[]>;
  getNearestBranch: () => Branch | null;
  calculateDistance: (branch: Branch) => number | null;
}

export const useBranchStore = create<BranchStore>()(
  persist(
    (set, get) => ({
      selectedBranch: null,
      branches: [],
      userLocation: null,
      isLoadingLocation: false,
      error: null,

      setSelectedBranch: branch => {
        set({ selectedBranch: branch });
        localStorage.setItem('selectedBranchId', branch.id);
      },

      setBranches: branches => set({ branches }),

      setUserLocation: location => set({ userLocation: location }),

      setLoadingLocation: loading => set({ isLoadingLocation: loading }),

      detectLocation: async () => {
        set({ isLoadingLocation: true, error: null });

        try {
          if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported');
          }

          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000, // 5 minutes
            });
          });

          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          set({ userLocation: location });

          // Fetch nearby branches
          const nearbyBranches = await get().fetchNearbyBranches(
            location.latitude,
            location.longitude
          );

          if (nearbyBranches.length > 0 && !get().selectedBranch) {
            get().setSelectedBranch(nearbyBranches[0]);
          }
        } catch (error) {
          console.error('Location detection failed:', error);
          set({ error: 'Unable to detect location' });

          // Fallback: fetch all branches
          await get().fetchBranches();
        } finally {
          set({ isLoadingLocation: false });
        }
      },

      fetchBranches: async () => {
        try {
          const response = await fetch('/api/company-management/branches');
          if (!response.ok) throw new Error('Failed to fetch branches');

          const data = await response.json();
          const branches = Array.isArray(data) ? data : data.data || [];

          // Transform the data to match the expected format
          const transformedBranches = branches.map((branch: any) => ({
            id: branch.id.toString(),
            name: branch.name,
            address: branch.address,
            city: branch.city,
            state: branch.state,
            postalCode: branch.postal_code,
            phone: branch.phone,
            isActive: branch.is_active,
            deliveryRadius: parseFloat(branch.delivery_radius || '20'),
            workingHours: {
              open: '06:00',
              close: '22:00',
              isOpen24Hours: false,
            },
            features: ['Home Delivery', 'Fresh Produce', 'Organic'],
            latitude: parseFloat(branch.latitude),
            longitude: parseFloat(branch.longitude),
          }));

          set({ branches: transformedBranches });

          // Auto-select first branch if none selected
          if (transformedBranches.length > 0 && !get().selectedBranch) {
            get().setSelectedBranch(transformedBranches[0]);
          }
        } catch (error) {
          console.error('Error fetching branches, using default branches:', error);
          
          // Use default branches for testing
          const defaultBranches: Branch[] = [
            {
              id: '1',
              name: 'Hyderabad Main Branch',
              address: 'Banjara Hills, Road No. 12',
              city: 'Hyderabad',
              state: 'Telangana',
              postalCode: '500034',
              phone: '+91 40 2335 5678',
              latitude: 17.4126,
              longitude: 78.4446,
              isActive: true,
              deliveryRadius: 20,
              workingHours: {
                open: '06:00',
                close: '22:00',
                isOpen24Hours: false,
              },
              features: ['Home Delivery', 'Fresh Produce', 'Organic'],
              deliveryFee: 0,
            },
            {
              id: '2',
              name: 'Visakhapatnam Beach Road',
              address: 'Beach Road, Kirlampudi Layout',
              city: 'Visakhapatnam',
              state: 'Andhra Pradesh',
              postalCode: '530017',
              phone: '+91 891 2564 789',
              latitude: 17.7249,
              longitude: 83.3111,
              isActive: true,
              deliveryRadius: 15,
              workingHours: {
                open: '06:00',
                close: '22:00',
                isOpen24Hours: false,
              },
              features: ['Home Delivery', 'Fresh Produce', 'Organic'],
              deliveryFee: 0,
            },
            {
              id: '3',
              name: 'Vijayawada Krishna Nagar',
              address: 'Krishna Nagar, Labbipet',
              city: 'Vijayawada',
              state: 'Andhra Pradesh',
              postalCode: '520010',
              phone: '+91 866 2476 890',
              latitude: 16.5193,
              longitude: 80.6305,
              isActive: true,
              deliveryRadius: 18,
              workingHours: {
                open: '06:00',
                close: '22:00',
                isOpen24Hours: false,
              },
              features: ['Home Delivery', 'Fresh Produce', 'Organic'],
              deliveryFee: 0,
            }
          ];
          
          set({ branches: defaultBranches });
          
          // Auto-select first branch if none selected
          if (defaultBranches.length > 0 && !get().selectedBranch) {
            get().setSelectedBranch(defaultBranches[0]);
          }
        }
      },

      fetchNearbyBranches: async (lat: number, lng: number) => {
        try {
          const response = await fetch(`/api/branches/nearby?lat=${lat}&lng=${lng}&radius=50`);
          if (!response.ok) throw new Error('Failed to fetch nearby branches');

          const data = await response.json();
          const branches = Array.isArray(data) ? data : data.data || [];

          set({ branches });
          return branches;
        } catch (error) {
          console.error('Error fetching nearby branches:', error);
          // Fallback to existing branches
          await get().fetchBranches();
          return get().branches;
        }
      },

      getNearestBranch: () => {
        const { branches, userLocation } = get();
        if (!userLocation || branches.length === 0) return null;

        let nearest = branches[0];
        let minDistance = Infinity;

        branches.forEach(branch => {
          const distance = get().calculateDistance(branch);
          if (distance && distance < minDistance) {
            minDistance = distance;
            nearest = branch;
          }
        });

        return nearest;
      },

      calculateDistance: branch => {
        const { userLocation } = get();
        if (!userLocation || !branch.latitude || !branch.longitude) return null;

        const R = 6371; // Earth's radius in kilometers
        const dLat = ((branch.latitude - userLocation.latitude) * Math.PI) / 180;
        const dLon = ((branch.longitude - userLocation.longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLocation.latitude * Math.PI) / 180) *
            Math.cos((branch.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      },
    }),
    {
      name: 'leafy-branch-storage',
      partialize: state => ({
        selectedBranch: state.selectedBranch,
        userLocation: state.userLocation,
      }),
    }
  )
);
