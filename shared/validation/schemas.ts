import { z } from 'zod';

// Authentication schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  userType: z.enum(['customer', 'admin', 'super_admin']).default('customer'),
});

// Product schemas
export const ProductCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  costPrice: z.number().positive('Cost price must be positive'),
  categoryId: z.number().positive('Category ID is required'),
  sku: z.string().min(1, 'SKU is required'),
  status: z.enum(['active', 'inactive']).default('active'),
  images: z.array(z.string()).optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

// Inventory schemas
export const InventoryAdjustmentSchema = z.object({
  productId: z.number().positive('Product ID is required'),
  branchId: z.number().positive('Branch ID is required'),
  adjustmentType: z.enum(['addition', 'subtraction', 'transfer']),
  quantity: z.number().positive('Quantity must be positive'),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
});

// Image upload schemas
export const ImageUploadSchema = z.object({
  entityType: z.string().min(1, 'Entity type is required'),
  entityId: z.number().optional(),
  description: z.string().optional(),
  altText: z.string().min(1, 'Alt text is required'),
  tags: z.string().optional(),
  category: z.string().optional(),
});

// Order schemas
export const OrderCreateSchema = z.object({
  customerId: z.number().positive('Customer ID is required'),
  branchId: z.number().positive('Branch ID is required'),
  items: z.array(z.object({
    productId: z.number().positive('Product ID is required'),
    quantity: z.number().positive('Quantity must be positive'),
    unitPrice: z.number().positive('Unit price must be positive'),
  })).min(1, 'At least one item is required'),
  paymentMethod: z.enum(['cash', 'card', 'online', 'upi']),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
});

// Type inference
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;
export type InventoryAdjustmentInput = z.infer<typeof InventoryAdjustmentSchema>;
export type ImageUploadInput = z.infer<typeof ImageUploadSchema>;
export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;