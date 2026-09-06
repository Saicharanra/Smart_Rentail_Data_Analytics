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
    const { id } = await params;
    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: { product: true, store: true },
    });

    if (!inventory) {
      return apiError('Inventory record not found', 404);
    }

    return apiSuccess(inventory);
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
    const validated = updateInventorySchema.parse(body);

    const inventory = await prisma.inventory.update({
      where: { id },
      data: validated,
      include: { product: true, store: true },
    });

    return apiSuccess(inventory, 'Inventory record updated successfully');
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
