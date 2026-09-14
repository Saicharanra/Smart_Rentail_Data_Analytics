import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { updateOrderStatusSchema } from '@/lib/validations/order';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: {
        customer: {
          include: { user: { select: { name: true, email: true } } },
        },
        items: {
          include: { product: { select: { name: true, sku: true, imageUrl: true } } },
        },
        payments: true,
        store: true,
      },
    });

    if (!order) {
      return apiError('Order not found', 404);
    }

    return apiSuccess({
      ...order,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shippingFee: Number(order.shippingFee),
      totalAmount: Number(order.totalAmount),
      items: order.items.map((i) => ({
        ...i,
        unitPrice: Number(i.unitPrice),
        totalPrice: Number(i.totalPrice),
      })),
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const validated = updateOrderStatusSchema.parse(body);

    const existing = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!existing) {
      return apiError('Order not found', 404);
    }

    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: {
        status: validated.status,
        ...(validated.trackingNumber ? { trackingNumber: validated.trackingNumber } : {}),
      },
    });

    return apiSuccess(updated, 'Order status updated successfully');
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
