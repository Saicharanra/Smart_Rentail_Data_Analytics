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

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        product: {
          select: { id: true, name: true, sku: true, imageUrl: true, price: true },
        },
      },
    });

    if (!review) {
      return apiError('Review record not found', 404);
    }

    const formatted = {
      id: review.id,
      rating: review.rating,
      title: review.title || 'No Title',
      comment: review.comment,
      createdAt: review.createdAt.toISOString().substring(0, 10),
      customerId: review.customerId,
      customerName: review.customer.user.name || 'Customer',
      customerEmail: review.customer.user.email,
      productId: review.productId,
      productName: review.product.name,
      productSku: review.product.sku,
      productPrice: Number(review.product.price),
      productImageUrl: review.product.imageUrl || '/images/placeholder.jpg',
    };

    return apiSuccess(formatted, 'Review details fetched successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const existing = await prisma.review.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError('Review record not found', 404);
    }

    await prisma.review.delete({
      where: { id },
    });

    return apiSuccess({ id }, 'Review record deleted successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
