import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(3, 'SKU is required'),
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  costPrice: z.number().positive('Cost price must be positive').optional(),
  categoryId: z.string().uuid('Valid Category ID required'),
  supplierId: z.string().uuid().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
