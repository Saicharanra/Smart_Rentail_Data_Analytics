import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { updateProductSchema } from '@/lib/validations/product';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { sku: id }, { slug: id }] },
      include: {
        category: true,
        supplier: true,
        inventoryItems: {
          include: { store: true },
        },
        reviews: {
          include: {
            customer: {
              include: { user: { select: { name: true, email: true } } },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    const totalStock = product.inventoryItems.reduce((sum, inv) => sum + inv.quantity, 0);

    return apiSuccess({
      ...product,
      price: Number(product.price),
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      totalStock,
    });
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
    const validated = updateProductSchema.parse(body);

    const product = await prisma.product.update({
      where: { id },
      data: validated,
      include: {
        category: true,
        supplier: true,
      },
    });

    return apiSuccess({
      ...product,
      price: Number(product.price),
      costPrice: product.costPrice ? Number(product.costPrice) : null,
    }, 'Product updated successfully');
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

    await prisma.product.delete({
      where: { id },
    });

    return apiSuccess(null, 'Product deleted successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
