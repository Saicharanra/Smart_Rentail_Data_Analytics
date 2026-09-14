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
    await requireAdmin(req);
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        inventoryItems: { include: { store: true } },
        orderItems: { select: { id: true, quantity: true, totalPrice: true } },
        reviews: { select: { id: true, rating: true, comment: true } },
      },
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    const totalStock = product.inventoryItems.reduce((sum, inv) => sum + inv.quantity, 0);

    return apiSuccess(
      {
        ...product,
        price: Number(product.price),
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        totalStock,
        orderCount: product.orderItems.length,
        reviewCount: product.reviews.length,
      },
      'Product details retrieved successfully'
    );
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
    const validated = updateProductSchema.parse(body);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Product not found', 404);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(validated.name ? { name: validated.name } : {}),
        ...(validated.sku ? { sku: validated.sku } : {}),
        ...(validated.description ? { description: validated.description } : {}),
        ...(validated.price !== undefined ? { price: validated.price } : {}),
        ...(validated.costPrice !== undefined ? { costPrice: validated.costPrice } : {}),
        ...(validated.categoryId ? { categoryId: validated.categoryId } : {}),
        ...(validated.supplierId !== undefined ? { supplierId: validated.supplierId } : {}),
        ...(validated.imageUrl !== undefined ? { imageUrl: validated.imageUrl } : {}),
        ...(validated.isActive !== undefined ? { isActive: validated.isActive } : {}),
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return apiSuccess(updated, 'Product updated successfully');
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

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
            inventoryItems: true,
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    // RELATIONAL SAFETY CHECK
    const hasOrderItems = product._count.orderItems > 0;
    const hasReviews = product._count.reviews > 0;

    if (hasOrderItems || hasReviews) {
      return apiError(
        `Cannot hard delete product "${product.name}" because it is referenced in ${product._count.orderItems} orders and ${product._count.reviews} reviews. Please deactivate the product (set Status to Inactive) instead.`,
        400,
        { canDeactivate: true }
      );
    }

    // Safe to delete if no historical order items or reviews reference it
    await prisma.inventory.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return apiSuccess(null, 'Product deleted successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
