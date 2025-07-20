import { create } from 'zustand';

interface Branch {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface BranchState {
  branches: Branch[];
  selectedBranch: Branch | null;
  isLoading: boolean;
  setBranches: (branches: Branch[]) => void;
  setSelectedBranch: (branch: Branch | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useBranchStore = create<BranchState>(set => ({
  branches: [
    { id: '1', name: 'Hyderabad Central', location: 'Hyderabad, Telangana', isActive: true },
    { id: '2', name: 'Vijayawada Branch', location: 'Vijayawada, Andhra Pradesh', isActive: true },
    {
      id: '3',
      name: 'Visakhapatnam Store',
      location: 'Visakhapatnam, Andhra Pradesh',
      isActive: true,
    },
    { id: '4', name: 'Warangal Outlet', location: 'Warangal, Telangana', isActive: true },
    { id: '5', name: 'Guntur Branch', location: 'Guntur, Andhra Pradesh', isActive: true },
  ],
  selectedBranch: null,
  isLoading: false,

  setBranches: (branches: Branch[]) => {
    set({ branches });
  },

  setSelectedBranch: (branch: Branch | null) => {
    set({ selectedBranch: branch });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
