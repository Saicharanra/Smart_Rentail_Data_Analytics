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
    const method = searchParams.get('method') || '';

    const whereClause: any = {};

    if (status && status !== 'All') {
      whereClause.status = status;
    }

    if (method && method !== 'All') {
      whereClause.method = method;
    }

    if (search) {
      whereClause.OR = [
        { transactionId: { contains: search, mode: 'insensitive' } },
        { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
        { order: { customer: { user: { name: { contains: search, mode: 'insensitive' } } } } },
        { order: { customer: { user: { email: { contains: search, mode: 'insensitive' } } } } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        order: {
          include: {
            customer: {
              include: {
                user: { select: { name: true, email: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = payments.map((p) => ({
      id: p.id,
      orderId: p.orderId,
      orderNumber: p.order.orderNumber,
      customerName: p.order.customer.user.name || 'Customer',
      customerEmail: p.order.customer.user.email,
      amount: Number(p.amount),
      method: p.method,
      status: p.status,
      transactionId: p.transactionId || 'N/A',
      createdAt: p.createdAt.toISOString().substring(0, 10),
    }));

    return apiSuccess(formatted, 'Payment records retrieved successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
