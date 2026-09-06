import { z } from 'zod';

export const createOrderItemSchema = z.object({
  productId: z.string().uuid('Valid Product ID required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  customerId: z.string().uuid('Valid Customer ID required').optional(),
  storeId: z.string().uuid().optional(),
  items: z.array(createOrderItemSchema).min(1, 'Order must contain at least one item'),
  shippingAddress: z.string().min(5, 'Shipping address is required'),
  paymentMethod: z.enum(['CREDIT_CARD', 'PAYPAL', 'APPLE_PAY']).default('CREDIT_CARD'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
