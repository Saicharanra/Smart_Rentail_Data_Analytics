import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { updateCategorySchema } from '@/lib/validations/category';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
        products: {
          select: { id: true, name: true, sku: true, price: true, imageUrl: true, isActive: true },
        },
      },
    });

    if (!category) {
      return apiError('Category not found', 404);
    }

    return apiSuccess({
      ...category,
      productCount: category._count.products,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const validated = updateCategorySchema.parse(body);

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(validated.name ? { name: validated.name } : {}),
        ...(validated.slug ? { slug: validated.slug } : {}),
        ...(validated.description !== undefined ? { description: validated.description } : {}),
        ...(validated.imageUrl !== undefined ? { imageUrl: validated.imageUrl } : {}),
      },
    });

    return apiSuccess(updated, 'Category updated successfully');
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
    await requireAdmin(req);
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return apiError('Category not found', 404);
    }

    // Safety Check: Do not delete category containing products
    if (category._count.products > 0) {
      return apiError(
        `Cannot delete category "${category.name}" because it contains ${category._count.products} associated product(s). Please reassign or delete the products first.`,
        400
      );
    }

    await prisma.category.delete({ where: { id } });

    return apiSuccess(null, 'Category deleted successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
