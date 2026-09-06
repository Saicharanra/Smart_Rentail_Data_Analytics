import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/permissions/auth-guard';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const payments = await prisma.payment.findMany({
      where: session.role === 'ADMIN' ? {} : { order: { customerId: session.customerId } },
      include: {
        order: { select: { orderNumber: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = payments.map((p) => ({
      id: p.id,
      orderId: p.orderId,
      orderNumber: p.order.orderNumber,
      amount: Number(p.amount),
      method: p.method,
      status: p.status,
      transactionId: p.transactionId,
      createdAt: p.createdAt,
    }));

    return apiSuccess(formatted, 'Payments retrieved successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      return apiError(err.message, 401);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
