import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
        orders: {
          include: {
            items: { include: { product: { select: { name: true, imageUrl: true } } } },
            payments: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          include: { product: { select: { name: true, imageUrl: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      return apiError('Customer record not found', 404);
    }

    const ordersCount = customer.orders.length;
    const totalSpent = customer.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const formattedOrders = customer.orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      totalAmount: Number(o.totalAmount),
      date: o.createdAt.toISOString().substring(0, 10),
      itemsCount: o.items.length,
      paymentMethod: o.payments[0]?.method || 'CREDIT_CARD',
    }));

    const formattedReviews = customer.reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      productName: r.product.name,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      date: r.createdAt.toISOString().substring(0, 10),
    }));

    return apiSuccess(
      {
        id: customer.id,
        userId: customer.userId,
        name: customer.user.name || 'Anonymous Customer',
        email: customer.user.email,
        phone: customer.phone || 'N/A',
        address: customer.address || 'N/A',
        city: customer.city || 'N/A',
        state: customer.state || 'N/A',
        postalCode: customer.postalCode || 'N/A',
        country: customer.country || 'USA',
        segment: customer.segment || 'Regular',
        joinedDate: customer.user.createdAt.toISOString().substring(0, 10),
        ordersCount,
        totalSpent,
        orders: formattedOrders,
        reviews: formattedReviews,
      },
      'Customer details retrieved successfully'
    );
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
