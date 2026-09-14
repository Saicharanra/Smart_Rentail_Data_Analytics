import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { updateStoreSchema } from '@/lib/validations/store';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        _count: { select: { inventoryItems: true, orders: true } },
        inventoryItems: {
          include: {
            product: { select: { name: true, sku: true, price: true, imageUrl: true } },
          },
        },
      },
    });

    if (!store) {
      return apiError('Store not found', 404);
    }

    return apiSuccess({
      ...store,
      inventoryCount: store._count.inventoryItems,
      ordersCount: store._count.orders,
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
    const validated = updateStoreSchema.parse(body);

    const updated = await prisma.store.update({
      where: { id },
      data: {
        ...(validated.name ? { name: validated.name } : {}),
        ...(validated.code ? { code: validated.code } : {}),
        ...(validated.address ? { address: validated.address } : {}),
        ...(validated.city ? { city: validated.city } : {}),
        ...(validated.state ? { state: validated.state } : {}),
        ...(validated.zipCode ? { zipCode: validated.zipCode } : {}),
        ...(validated.isOnline !== undefined ? { isOnline: validated.isOnline } : {}),
      },
    });

    return apiSuccess(updated, 'Store updated successfully');
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

    const store = await prisma.store.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });

    if (!store) {
      return apiError('Store not found', 404);
    }

    if (store._count.orders > 0) {
      return apiError(
        `Cannot delete store "${store.name}" because it is associated with ${store._count.orders} order(s).`,
        400
      );
    }

    await prisma.inventory.deleteMany({ where: { storeId: id } });
    await prisma.store.delete({ where: { id } });

    return apiSuccess(null, 'Store deleted successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
