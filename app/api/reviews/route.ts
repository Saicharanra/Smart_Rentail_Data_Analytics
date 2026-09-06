import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/permissions/auth-guard';
import { createReviewSchema } from '@/lib/validations/review';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;

    const reviews = await prisma.review.findMany({
      where: productId ? { productId } : {},
      include: {
        customer: {
          include: { user: { select: { name: true, email: true } } },
        },
        product: { select: { id: true, name: true, sku: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      productName: r.product.name,
      author: r.customer.user.name || 'Anonymous',
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      createdAt: r.createdAt,
    }));

    return apiSuccess(formatted, 'Reviews retrieved successfully');
  } catch (err: any) {
    return apiError(err.message || 'Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session.customerId) {
      return apiError('Customer profile required to create review', 400);
    }

    const body = await req.json();
    const validated = createReviewSchema.parse(body);

    const review = await prisma.review.create({
      data: {
        customerId: session.customerId,
        productId: validated.productId,
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
      },
      include: {
        customer: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    return apiSuccess(
      {
        id: review.id,
        productId: review.productId,
        author: review.customer.user.name || 'Anonymous',
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt,
      },
      'Review submitted successfully',
      201
    );
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      return apiError(err.message, 401);
    }
    if (err.name === 'ZodError') {
      return apiError('Validation error', 400, err.errors);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
