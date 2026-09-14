import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z.string().min(2, 'Supplier name is required'),
  contactPerson: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(),
  leadTimeDays: z.number().int().min(0).optional().default(5),
  rating: z.number().min(0).max(5).optional().default(4.5),
  status: z.string().optional().default('Active'),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
