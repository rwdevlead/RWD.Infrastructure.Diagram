// Common API response envelope
export interface ApiResponse<T> {
  data?: T;
  error?: string | null;
}

// Hardware Type Definitions
export interface Hardware {
  id: number;
  name: string;
  hostname: string | null;
  ipAddress: string | null;
  macAddress: string | null;
  cpu: string | null;
  ramGb: number | null;
  os: string | null;
  make: string | null;
  model: string | null;
  serialNumber: string | null;
  location: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HardwareRequest {
  name: string;
  hostname?: string | null;
  ipAddress?: string | null;
  macAddress?: string | null;
  cpu?: string | null;
  ramGb?: number | null;
  os?: string | null;
  make?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  location?: string | null;
  notes?: string | null;
}

// Virtual Machine Type Definitions
export interface VirtualMachine {
  id: number;
  hardwareId: number;
  name: string;
  hostname: string | null;
  ipAddress: string | null;
  os: string | null;
  cpuCores: number | null;
  ramGb: number | null;
  diskGb: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VirtualMachineRequest {
  hardwareId: number;
  name: string;
  hostname?: string | null;
  ipAddress?: string | null;
  os?: string | null;
  cpuCores?: number | null;
  ramGb?: number | null;
  diskGb?: number | null;
  notes?: string | null;
}

// Application / Service Type Definitions
export interface App {
  id: number;
  name: string;
  description: string | null;
  ipAddress: string | null;
  port: number | null;
  https: boolean;
  url: string | null;
  notes: string | null;
  hardwareId: number | null;
  virtualMachineId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppRequest {
  name: string;
  description?: string | null;
  ipAddress?: string | null;
  port?: number | null;
  https: boolean;
  url?: string | null;
  notes?: string | null;
  hardwareId?: number | null;
  virtualMachineId?: number | null;
}

// Storage Pool Type Definitions
export interface Storage {
  id: number;
  name: string;
  storageType: string | null;
  raidType: string | null;
  usableSpaceTb: number | null;
  notes: string | null;
  hardwareId: number | null;
  virtualMachineId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface StorageRequest {
  name: string;
  storageType?: string | null;
  raidType?: string | null;
  usableSpaceTb?: number | null;
  notes?: string | null;
  hardwareId?: number | null;
  virtualMachineId?: number | null;
}

// Network Share Type Definitions
export interface NetworkShare {
  id: number;
  storageId: number;
  name: string;
  shareType: string | null;
  hostname: string | null;
  ip: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NetworkShareRequest {
  storageId: number;
  name: string;
  shareType?: string | null;
  hostname?: string | null;
  ip?: string | null;
  notes?: string | null;
}

// Network Definition Type Definitions
export interface Network {
  id: number;
  name: string;
  vlanId: number | null;
  subnet: string | null;
  gateway: string | null;
  color: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NetworkRequest {
  name: string;
  vlanId?: number | null;
  subnet?: string | null;
  gateway?: string | null;
  color?: string | null;
  notes?: string | null;
}

// Network Member Type Definitions
export interface NetworkMember {
  id: number;
  networkId: number;
  memberType: string; // "hardware", "vm", etc.
  memberId: number;
  ipOnNetwork: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NetworkMemberRequest {
  networkId: number;
  memberType: string;
  memberId: number;
  ipOnNetwork?: string | null;
}

// Markdown Document Type Definitions
export interface Document {
  id: number;
  title: string;
  content: string;
  parentId: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRequest {
  title: string;
  content: string;
  parentId?: number | null;
  sortOrder: number;
}

// Relationships Type Definitions
export interface Relationship {
  id: number;
  sourceType: string;
  sourceId: number;
  targetType: string;
  targetId: number;
  label: string | null;
  relationshipType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipRequest {
  sourceType: string;
  sourceId: number;
  targetType: string;
  targetId: number;
  label?: string | null;
  relationshipType?: string | null;
}

// Map Layout Type Definitions
export interface MapLayout {
  id: number;
  nodeType: string;
  nodeId: number;
  x: number;
  y: number;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MapLayoutRequest {
  nodeType: string;
  nodeId: number;
  x: number;
  y: number;
  locked: boolean;
}

// Search & Export/Import DTOs
export interface InventorySearchResult {
  entityType: string; // "hardware" | "vm" | "app" | "storage" | "network" | "document"
  id: number;
  name: string;
  hostname: string | null;
  ipOrSubnet: string | null;
}

export interface DatabaseExport {
  exportedAt: string;
  hardware: Hardware[] | null;
  virtualMachines: VirtualMachine[] | null;
  apps: App[] | null;
  storagePools: Storage[] | null;
  networkShares: NetworkShare[] | null;
  networks: Network[] | null;
  networkMembers: NetworkMember[] | null;
  relationships: Relationship[] | null;
  mapLayouts: MapLayout[] | null;
  documents: Document[] | null;
}
