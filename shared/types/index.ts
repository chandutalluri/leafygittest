// Shared type definitions for LeafyHealth platform

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  userType: 'customer' | 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  categoryId: number;
  sku: string;
  status: 'active' | 'inactive';
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  productId: number;
  productName: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  branchId: number;
  branchName: string;
  unitPrice: string;
  stockValue: string;
  stockStatus: 'low' | 'normal' | 'high';
  lastUpdated: string;
}

export interface ImageMetadata {
  id: string;
  filename: string;
  originalFilename: string;
  sizeBytes: number;
  mimeType: string;
  width?: number;
  height?: number;
  description?: string;
  altText?: string;
  tags?: string[];
  entityType?: string;
  entityId?: number;
  uploadedAt: string;
  serveUrl: string;
  previewUrl: string;
}