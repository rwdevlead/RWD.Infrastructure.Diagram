import { create } from 'zustand';
import { apiService } from '../api/client';
import {
  Hardware, VirtualMachine, App, Storage, NetworkShare, Network, NetworkMember, Document
} from '../api/types';

interface StoreState {
  hardware: Hardware[];
  vms: VirtualMachine[];
  apps: App[];
  storage: Storage[];
  shares: NetworkShare[];
  networks: Network[];
  networkMembers: NetworkMember[];
  documents: Document[];

  loading: Record<string, boolean>;
  errors: Record<string, string | null>;

  setLoading: (key: string, value: boolean) => void;
  setError: (key: string, value: string | null) => void;

  fetchHardware: () => Promise<void>;
  fetchVMs: () => Promise<void>;
  fetchApps: () => Promise<void>;
  fetchStorage: () => Promise<void>;
  fetchShares: () => Promise<void>;
  fetchNetworks: () => Promise<void>;
  fetchNetworkMembers: () => Promise<void>;
  fetchDocuments: () => Promise<void>;

  fetchAll: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  hardware: [],
  vms: [],
  apps: [],
  storage: [],
  shares: [],
  networks: [],
  networkMembers: [],
  documents: [],

  loading: {},
  errors: {},

  setLoading: (key, value) => set((state) => ({
    loading: { ...state.loading, [key]: value }
  })),

  setError: (key, value) => set((state) => ({
    errors: { ...state.errors, [key]: value }
  })),

  fetchHardware: async () => {
    get().setLoading('hardware', true);
    get().setError('hardware', null);
    try {
      const data = await apiService.getHardwareList();
      set({ hardware: data });
    } catch (err: any) {
      get().setError('hardware', err.message || 'Failed to fetch hardware');
    } finally {
      get().setLoading('hardware', false);
    }
  },

  fetchVMs: async () => {
    get().setLoading('vms', true);
    get().setError('vms', null);
    try {
      const data = await apiService.getVMList();
      set({ vms: data });
    } catch (err: any) {
      get().setError('vms', err.message || 'Failed to fetch VMs');
    } finally {
      get().setLoading('vms', false);
    }
  },

  fetchApps: async () => {
    get().setLoading('apps', true);
    get().setError('apps', null);
    try {
      const data = await apiService.getAppList();
      set({ apps: data });
    } catch (err: any) {
      get().setError('apps', err.message || 'Failed to fetch applications');
    } finally {
      get().setLoading('apps', false);
    }
  },

  fetchStorage: async () => {
    get().setLoading('storage', true);
    get().setError('storage', null);
    try {
      const data = await apiService.getStorageList();
      set({ storage: data });
    } catch (err: any) {
      get().setError('storage', err.message || 'Failed to fetch storage');
    } finally {
      get().setLoading('storage', false);
    }
  },

  fetchShares: async () => {
    get().setLoading('shares', true);
    get().setError('shares', null);
    try {
      const data = await apiService.getShareList();
      set({ shares: data });
    } catch (err: any) {
      get().setError('shares', err.message || 'Failed to fetch network shares');
    } finally {
      get().setLoading('shares', false);
    }
  },

  fetchNetworks: async () => {
    get().setLoading('networks', true);
    get().setError('networks', null);
    try {
      const data = await apiService.getNetworkList();
      set({ networks: data });
    } catch (err: any) {
      get().setError('networks', err.message || 'Failed to fetch networks');
    } finally {
      get().setLoading('networks', false);
    }
  },

  fetchNetworkMembers: async () => {
    get().setLoading('networkMembers', true);
    get().setError('networkMembers', null);
    try {
      const data = await apiService.getNetworkMemberList();
      set({ networkMembers: data });
    } catch (err: any) {
      get().setError('networkMembers', err.message || 'Failed to fetch network members');
    } finally {
      get().setLoading('networkMembers', false);
    }
  },

  fetchDocuments: async () => {
    get().setLoading('documents', true);
    get().setError('documents', null);
    try {
      const data = await apiService.getDocumentList();
      set({ documents: data });
    } catch (err: any) {
      get().setError('documents', err.message || 'Failed to fetch documents');
    } finally {
      get().setLoading('documents', false);
    }
  },

  fetchAll: async () => {
    // Run all fetches concurrently
    await Promise.allSettled([
      get().fetchHardware(),
      get().fetchVMs(),
      get().fetchApps(),
      get().fetchStorage(),
      get().fetchShares(),
      get().fetchNetworks(),
      get().fetchNetworkMembers(),
      get().fetchDocuments()
    ]);
  }
}));
