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
    const { id } = await params;

    const category = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }, { name: id }] },
      include: {
        products: {
          where: { isActive: true },
          include: {
            inventoryItems: true,
            _count: { select: { reviews: true } },
          },
        },
      },
    });

    if (!category) {
      return apiError('Category not found', 404);
    }

    const formattedProducts = category.products.map((p) => {
      const totalStock = p.inventoryItems.reduce((sum, inv) => sum + inv.quantity, 0);
      return {
        ...p,
        price: Number(p.price),
        costPrice: p.costPrice ? Number(p.costPrice) : null,
        totalStock,
        reviewCount: p._count.reviews,
      };
    });

    return apiSuccess({
      ...category,
      itemCount: category.products.length,
      products: formattedProducts,
    }, 'Category fetched successfully');
  } catch (err: any) {
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

    const category = await prisma.category.update({
      where: { id },
      data: validated,
    });

    return apiSuccess(category, 'Category updated successfully');
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

    await prisma.category.delete({
      where: { id },
    });

    return apiSuccess(null, 'Category deleted successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
