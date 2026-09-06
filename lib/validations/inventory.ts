import { z } from 'zod';

export const createInventorySchema = z.object({
  productId: z.string().uuid('Valid Product ID required'),
  storeId: z.string().uuid('Valid Store ID required'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  reservedQuantity: z.number().int().min(0).optional().default(0),
  reorderLevel: z.number().int().min(0).optional().default(10),
});

export const updateInventorySchema = z.object({
  quantity: z.number().int().min(0).optional(),
  reservedQuantity: z.number().int().min(0).optional(),
  reorderLevel: z.number().int().min(0).optional(),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
