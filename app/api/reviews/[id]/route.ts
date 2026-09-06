import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/permissions/auth-guard';
import { updateReviewSchema } from '@/lib/validations/review';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(req);
    const { id } = await params;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Review not found', 404);
    }

    if (session.role !== 'ADMIN' && existing.customerId !== session.customerId) {
      return apiError('Forbidden', 403);
    }

    const body = await req.json();
    const validated = updateReviewSchema.parse(body);

    const review = await prisma.review.update({
      where: { id },
      data: validated,
    });

    return apiSuccess(review, 'Review updated successfully');
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(req);
    const { id } = await params;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Review not found', 404);
    }

    if (session.role !== 'ADMIN' && existing.customerId !== session.customerId) {
      return apiError('Forbidden', 403);
    }

    await prisma.review.delete({ where: { id } });

    return apiSuccess(null, 'Review deleted successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
