import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const rating = searchParams.get('rating') || '';

    const whereClause: any = {};

    if (rating && rating !== 'All') {
      const numericRating = parseInt(rating, 10);
      if (!isNaN(numericRating)) {
        whereClause.rating = numericRating;
      }
    }

    if (search) {
      whereClause.OR = [
        { comment: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
        { product: { sku: { contains: search, mode: 'insensitive' } } },
        { customer: { user: { name: { contains: search, mode: 'insensitive' } } } },
        { customer: { user: { email: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        customer: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        product: {
          select: { id: true, name: true, sku: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title || 'No Title',
      comment: r.comment,
      createdAt: r.createdAt.toISOString().substring(0, 10),
      customerId: r.customerId,
      customerName: r.customer.user.name || 'Customer',
      customerEmail: r.customer.user.email,
      productId: r.productId,
      productName: r.product.name,
      productSku: r.product.sku,
      productImageUrl: r.product.imageUrl || '/images/placeholder.jpg',
    }));

    return apiSuccess(formatted, 'Reviews retrieved successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
