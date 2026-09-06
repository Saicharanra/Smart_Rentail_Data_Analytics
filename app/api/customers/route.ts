import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const customers = await prisma.customer.findMany({
      include: {
        user: { select: { name: true, email: true, role: true } },
        _count: { select: { orders: true, reviews: true } },
        orders: { select: { totalAmount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = customers.map((c) => {
      const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
      return {
        id: c.id,
        name: c.user.name || 'N/A',
        email: c.user.email,
        phone: c.phone,
        city: c.city,
        state: c.state,
        segment: c.segment,
        ordersCount: c._count.orders,
        totalSpent,
        createdAt: c.createdAt,
      };
    });

    return apiSuccess(formatted, 'Customer directory retrieved successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
