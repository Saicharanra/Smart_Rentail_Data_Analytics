import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const segment = searchParams.get('segment') || '';

    const whereClause: any = {};

    if (segment && segment !== 'All') {
      whereClause.segment = segment;
    }

    if (search) {
      whereClause.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { city: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true, createdAt: true } },
        orders: { select: { id: true, totalAmount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = customers.map((c) => {
      const ordersCount = c.orders.length;
      const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

      return {
        id: c.id,
        userId: c.userId,
        name: c.user.name || 'Anonymous Customer',
        email: c.user.email,
        phone: c.phone || 'N/A',
        address: c.address || 'N/A',
        city: c.city || 'N/A',
        state: c.state || 'N/A',
        segment: c.segment || 'Regular',
        joinedDate: c.user.createdAt.toISOString().substring(0, 10),
        ordersCount,
        totalSpent,
      };
    });

    return apiSuccess(formatted, 'Customers retrieved successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
