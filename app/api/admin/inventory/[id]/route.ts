import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { updateInventorySchema } from '@/lib/validations/inventory';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: {
        product: { include: { category: true, supplier: true } },
        store: true,
      },
    });

    if (!inventory) {
      return apiError('Inventory item not found', 404);
    }

    return apiSuccess({
      ...inventory,
      unitPrice: Number(inventory.product.price),
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

    const existing = await prisma.inventory.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Inventory record not found', 404);
    }

    const validated = updateInventorySchema.parse(body);

    // NEGATIVE STOCK PREVENTION
    if (validated.quantity !== undefined && validated.quantity < 0) {
      return apiError('Inventory stock quantity cannot be negative (must be >= 0).', 400);
    }

    const updated = await prisma.inventory.update({
      where: { id },
      data: {
        ...(validated.quantity !== undefined ? { quantity: validated.quantity } : {}),
        ...(validated.reservedQuantity !== undefined ? { reservedQuantity: validated.reservedQuantity } : {}),
        ...(validated.reorderLevel !== undefined ? { reorderLevel: validated.reorderLevel } : {}),
      },
      include: {
        product: { select: { name: true, sku: true } },
        store: { select: { name: true } },
      },
    });

    return apiSuccess(updated, 'Inventory stock updated successfully');
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
