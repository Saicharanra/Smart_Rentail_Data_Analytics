import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().min(2, 'Store name is required'),
  code: z.string().min(2, 'Store code is required'),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(2, 'Zip code is required'),
  isOnline: z.boolean().optional().default(false),
});

export const updateStoreSchema = createStoreSchema.partial();

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
