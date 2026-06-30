import axios from 'axios';
import {
  Hardware, HardwareRequest,
  VirtualMachine, VirtualMachineRequest,
  App, AppRequest,
  Storage, StorageRequest,
  NetworkShare, NetworkShareRequest,
  Network, NetworkRequest,
  NetworkMember, NetworkMemberRequest,
  Document, DocumentRequest,
  Relationship, RelationshipRequest,
  MapLayout, MapLayoutRequest,
  InventorySearchResult, DatabaseExport,
  ApiResponse
} from './types';

// Create custom Axios instance
const api = axios.create({
  // baseURL is blank because we proxy in vite.config.ts in development
  // and serve from the same domain in production.
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to extract data or throw on error
const handleResponse = <T>(response: { data: ApiResponse<T> }): T => {
  const envelope = response.data;
  if (envelope.error) {
    throw new Error(envelope.error);
  }
  if (envelope.data === undefined) {
    throw new Error("No data returned from server");
  }
  return envelope.data;
};

export const apiService = {
  // --- Health ---
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  },

  // --- Hardware ---
  getHardwareList: async (): Promise<Hardware[]> => {
    const res = await api.get<ApiResponse<Hardware[]>>('/api/hardware');
    return handleResponse(res);
  },
  getHardwareById: async (id: number): Promise<Hardware> => {
    const res = await api.get<ApiResponse<Hardware>>(`/api/hardware/${id}`);
    return handleResponse(res);
  },
  createHardware: async (data: HardwareRequest): Promise<Hardware> => {
    const res = await api.post<ApiResponse<Hardware>>('/api/hardware', data);
    return handleResponse(res);
  },
  updateHardware: async (id: number, data: HardwareRequest): Promise<Hardware> => {
    const res = await api.put<ApiResponse<Hardware>>(`/api/hardware/${id}`, data);
    return handleResponse(res);
  },
  deleteHardware: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResponse<string>>(`/api/hardware/${id}`);
    return handleResponse(res);
  },

  // --- Virtual Machines ---
  getVMList: async (): Promise<VirtualMachine[]> => {
    const res = await api.get<ApiResponse<VirtualMachine[]>>('/api/vms');
    return handleResponse(res);
  },
  getVMById: async (id: number): Promise<VirtualMachine> => {
    const res = await api.get<ApiResponse<VirtualMachine>>(`/api/vms/${id}`);
    return handleResponse(res);
  },
  createVM: async (data: VirtualMachineRequest): Promise<VirtualMachine> => {
    const res = await api.post<ApiResponse<VirtualMachine>>('/api/vms', data);
    return handleResponse(res);
  },
  updateVM: async (id: number, data: VirtualMachineRequest): Promise<VirtualMachine> => {
    const res = await api.put<ApiResponse<VirtualMachine>>(`/api/vms/${id}`, data);
    return handleResponse(res);
  },
  deleteVM: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResponse<string>>(`/api/vms/${id}`);
    return handleResponse(res);
  },

  // --- Apps ---
  getAppList: async (): Promise<App[]> => {
    const res = await api.get<ApiResponse<App[]>>('/api/apps');
    return handleResponse(res);
  },
  getAppById: async (id: number): Promise<App> => {
    const res = await api.get<ApiResponse<App>>(`/api/apps/${id}`);
    return handleResponse(res);
  },
  createApp: async (data: AppRequest): Promise<App> => {
    const res = await api.post<ApiResponse<App>>('/api/apps', data);
    return handleResponse(res);
  },
  updateApp: async (id: number, data: AppRequest): Promise<App> => {
    const res = await api.put<ApiResponse<App>>(`/api/apps/${id}`, data);
    return handleResponse(res);
  },
  deleteApp: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResponse<string>>(`/api/apps/${id}`);
    return handleResponse(res);
  },

  // --- Storage Pools ---
  getStorageList: async (): Promise<Storage[]> => {
    const res = await api.get<ApiResponse<Storage[]>>('/api/storage');
    return handleResponse(res);
  },
  getStorageById: async (id: number): Promise<Storage> => {
    const res = await api.get<ApiResponse<Storage>>(`/api/storage/${id}`);
    return handleResponse(res);
  },
  createStorage: async (data: StorageRequest): Promise<Storage> => {
    const res = await api.post<ApiResponse<Storage>>('/api/storage', data);
    return handleResponse(res);
  },
  updateStorage: async (id: number, data: StorageRequest): Promise<Storage> => {
    const res = await api.put<ApiResponse<Storage>>(`/api/storage/${id}`, data);
    return handleResponse(res);
  },
  deleteStorage: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResponse<string>>(`/api/storage/${id}`);
    return handleResponse(res);
  },

  // --- Network Shares ---
  getShareList: async (): Promise<NetworkShare[]> => {
    const res = await api.get<ApiResponse<NetworkShare[]>>('/api/shares');
    return handleResponse(res);
  },
  getShareById: async (id: number): Promise<NetworkShare> => {
    const res = await api.get<ApiResponse<NetworkShare>>(`/api/shares/${id}`);
    return handleResponse(res);
  },
  createShare: async (data: NetworkShareRequest): Promise<NetworkShare> => {
    const res = await api.post<ApiResponse<NetworkShare>>('/api/shares', data);
    return handleResponse(res);
  },
  updateShare: async (id: number, data: NetworkShareRequest): Promise<NetworkShare> => {
    const res = await api.put<ApiResponse<NetworkShare>>(`/api/shares/${id}`, data);
    return handleResponse(res);
  },
  deleteShare: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResponse<string>>(`/api/shares/${id}`);
    return handleResponse(res);
  },

  // --- Networks ---
  getNetworkList: async (): Promise<Network[]> => {
    const res = await api.get<ApiResponse<Network[]>>('/api/networks');
    return handleResponse(res);
  },
  getNetworkById: async (id: number): Promise<Network> => {
    const res = await api.get<ApiResponse<Network>>(`/api/networks/${id}`);
    return handleResponse(res);
  },
  createNetwork: async (data: NetworkRequest): Promise<Network> => {
    const res = await api.post<ApiResponse<Network>>('/api/networks', data);
    return handleResponse(res);
  },
  updateNetwork: async (id: number, data: NetworkRequest): Promise<Network> => {
    const res = await api.put<ApiResponse<Network>>(`/api/networks/${id}`, data);
    return handleResponse(res);
  },
  deleteNetwork: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResponse<string>>(`/api/networks/${id}`);
    return handleResponse(res);
  },

  // --- Network Members ---
  getNetworkMemberList: async (): Promise<NetworkMember[]> => {
    const res = await api.get<ApiResponse<NetworkMember[]>>('/api/network-members');
    return handleResponse(res);
  },
  getNetworkMemberById: async (id: number): Promise<NetworkMember> => {
    const res = await api.get<ApiResponse<NetworkMember>>(`/api/network-members/${id}`);
    return handleResponse(res);
  },
  createNetworkMember: async (data: NetworkMemberRequest): Promise<NetworkMember> => {
    const res = await api.post<ApiResponse<NetworkMember>>('/api/network-members', data);
    return handleResponse(res);
  },
  updateNetworkMember: async (id: number, data: NetworkMemberRequest): Promise<NetworkMember> => {
    const res = await api.put<ApiResponse<NetworkMember>>(`/api/network-members/${id}`, data);
    return handleResponse(res);
  },
  deleteNetworkMember: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResponse<string>>(`/api/network-members/${id}`);
    return handleResponse(res);
  },

  // --- Documents ---
  getDocumentList: async (): Promise<Document[]> => {
    const res = await api.get<ApiResponse<Document[]>>('/api/documents');
    return handleResponse(res);
  },
  getDocumentById: async (id: number): Promise<Document> => {
    const res = await api.get<ApiResponse<Document>>(`/api/documents/${id}`);
    return handleResponse(res);
  },
  createDocument: async (data: DocumentRequest): Promise<Document> => {
    const res = await api.post<ApiResponse<Document>>('/api/documents', data);
    return handleResponse(res);
  },
  updateDocument: async (id: number, data: DocumentRequest): Promise<Document> => {
    const res = await api.put<ApiResponse<Document>>(`/api/documents/${id}`, data);
    return handleResponse(res);
  },
  deleteDocument: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResponse<string>>(`/api/documents/${id}`);
    return handleResponse(res);
  },

  // --- Map Layout & Relationships ---
  getMapLayout: async (): Promise<MapLayout[]> => {
    const res = await api.get<ApiResponse<MapLayout[]>>('/api/map/layout');
    return handleResponse(res);
  },
  saveMapLayout: async (data: MapLayoutRequest): Promise<MapLayout> => {
    const res = await api.post<ApiResponse<MapLayout>>('/api/map/layout', data);
    return handleResponse(res);
  },
  deleteMapLayout: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResponse<string>>(`/api/map/layout/${id}`);
    return handleResponse(res);
  },
  getMapRelationships: async (): Promise<Relationship[]> => {
    const res = await api.get<ApiResponse<Relationship[]>>('/api/map/relationships');
    return handleResponse(res);
  },
  createMapRelationship: async (data: RelationshipRequest): Promise<Relationship> => {
    const res = await api.post<ApiResponse<Relationship>>('/api/map/relationships', data);
    return handleResponse(res);
  },
  deleteMapRelationship: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResponse<string>>(`/api/map/relationships/${id}`);
    return handleResponse(res);
  },

  // --- Inventory search, export, import ---
  searchInventory: async (q: string): Promise<InventorySearchResult[]> => {
    const res = await api.get<ApiResponse<InventorySearchResult[]>>(`/api/inventory/search?q=${encodeURIComponent(q)}`);
    return handleResponse(res);
  },
  exportInventory: async (): Promise<DatabaseExport> => {
    const res = await api.get<ApiResponse<DatabaseExport>>('/api/inventory/export');
    return handleResponse(res);
  },
  importInventory: async (data: DatabaseExport): Promise<string> => {
    const res = await api.post<ApiResponse<string>>('/api/inventory/import', data);
    return handleResponse(res);
  }
};
