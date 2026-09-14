import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const whereClause: any = {};

    if (status && status !== 'All') {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { customer: { user: { name: { contains: search, mode: 'insensitive' } } } },
        { customer: { user: { email: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        customer: {
          include: { user: { select: { name: true, email: true } } },
        },
        items: { select: { id: true, quantity: true } },
        payments: { select: { method: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customer.user.name || 'Customer',
      customerEmail: o.customer.user.email,
      status: o.status,
      subtotal: Number(o.subtotal),
      tax: Number(o.tax),
      shippingFee: Number(o.shippingFee),
      totalAmount: Number(o.totalAmount),
      shippingAddress: o.shippingAddress,
      trackingNumber: o.trackingNumber,
      itemsCount: o.items.length,
      paymentMethod: o.payments[0]?.method || 'CREDIT_CARD',
      paymentStatus: o.payments[0]?.status || 'COMPLETED',
      createdAt: o.createdAt.toISOString().substring(0, 10),
    }));

    return apiSuccess(formatted, 'Orders retrieved successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
