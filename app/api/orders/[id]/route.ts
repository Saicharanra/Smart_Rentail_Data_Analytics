import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, getAuthSession } from '@/lib/permissions/auth-guard';
import { updateOrderStatusSchema } from '@/lib/validations/order';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession(req);

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

    if (session?.role !== 'ADMIN' && order.customerId !== session?.customerId) {
      return apiError('Forbidden', 403);
    }

    return apiSuccess({
      ...order,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shippingFee: Number(order.shippingFee),
      totalAmount: Number(order.totalAmount),
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
    await requireAdmin(req);
    const { id } = await params;

    const body = await req.json();
    const validated = updateOrderStatusSchema.parse(body);

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: validated.status,
        ...(validated.trackingNumber ? { trackingNumber: validated.trackingNumber } : {}),
      },
    });

    return apiSuccess(order, 'Order status updated successfully');
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
