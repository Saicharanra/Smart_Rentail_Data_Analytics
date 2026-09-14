import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getAuthSession } from '@/lib/permissions/auth-guard';
import { updateOrderStatusSchema } from '@/lib/validations/order';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession(req);

    if (!session) {
      return apiError('Authentication required', 401);
    }

    const order = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: {
        customer: {
          include: { user: { select: { name: true, email: true } } },
        },
        items: {
          include: { product: true },
        },
        payments: true,
      },
    });

    if (!order) {
      return apiError('Order not found', 404);
    }

    // Customer Ownership Security Check
    if (session.role !== 'ADMIN' && order.customerId !== session.customerId) {
      return apiError('Forbidden: You can only view your own order details.', 403);
    }

    return apiSuccess({
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customer.user.name || 'Customer',
      customerEmail: order.customer.user.email,
      status: order.status,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shippingFee: Number(order.shippingFee),
      totalAmount: Number(order.totalAmount),
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      payments: order.payments.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        method: p.method,
        status: p.status,
        transactionId: p.transactionId,
        createdAt: p.createdAt.toISOString(),
      })),
      items: order.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        productName: i.product.name,
        productSku: i.product.sku,
        productImageUrl: i.product.imageUrl,
        unitPrice: Number(i.unitPrice),
        quantity: i.quantity,
        totalPrice: Number(i.totalPrice),
      })),
    });
  } catch (err: any) {
    return apiError(err.message || 'Internal server error', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(req);
    const { id } = await params;

    const body = await req.json();
    const validated = updateOrderStatusSchema.parse(body);

    const existingOrder = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: { items: true, payments: true },
    });

    if (!existingOrder) {
      return apiError('Order record not found', 404);
    }

    // Role-based Authorization Scoping
    if (session.role !== 'ADMIN') {
      if (existingOrder.customerId !== session.customerId) {
        return apiError('Forbidden: You can only update your own order.', 403);
      }
      // Customers may only request CANCELLED status on PENDING or PROCESSING orders
      if (validated.status !== 'CANCELLED') {
        return apiError('Customers are only authorized to cancel their orders.', 403);
      }
      if (existingOrder.status !== 'PENDING' && existingOrder.status !== 'PROCESSING') {
        return apiError(`Orders in status ${existingOrder.status} can no longer be cancelled by customer.`, 400);
      }
    }

    // Handle Order Cancellation & Restocking Transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const isNewlyCancelled = validated.status === 'CANCELLED' && existingOrder.status !== 'CANCELLED';

      const orderResult = await tx.order.update({
        where: { id: existingOrder.id },
        data: {
          status: validated.status,
          ...(validated.trackingNumber ? { trackingNumber: validated.trackingNumber } : {}),
        },
      });

      if (isNewlyCancelled) {
        // 1. Restock Inventory
        for (const item of existingOrder.items) {
          const invRecord = await tx.inventory.findFirst({
            where: { productId: item.productId },
          });

          if (invRecord) {
            await tx.inventory.update({
              where: { id: invRecord.id },
              data: {
                quantity: { increment: item.quantity },
              },
            });
          }
        }

        // 2. Mark Payment as REFUNDED if completed
        await tx.payment.updateMany({
          where: { orderId: existingOrder.id },
          data: { status: 'REFUNDED' },
        });
      }

      return orderResult;
    });

    return apiSuccess(
      {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        trackingNumber: updatedOrder.trackingNumber,
      },
      `Order status updated to ${updatedOrder.status}`
    );
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    if (err.name === 'ZodError') {
      return apiError('Validation error', 400, err.errors);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
