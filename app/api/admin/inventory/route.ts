import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const storeId = searchParams.get('storeId') || '';
    const stockStatus = searchParams.get('stockStatus') || '';

    const whereClause: any = {};

    if (storeId && storeId !== 'All') {
      whereClause.storeId = storeId;
    }

    if (search) {
      whereClause.OR = [
        { product: { name: { contains: search, mode: 'insensitive' } } },
        { product: { sku: { contains: search, mode: 'insensitive' } } },
        { store: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const inventory = await prisma.inventory.findMany({
      where: whereClause,
      include: {
        product: {
          select: { id: true, name: true, sku: true, price: true, imageUrl: true, category: { select: { name: true } } },
        },
        store: { select: { id: true, name: true, code: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formatted = inventory
      .map((inv) => {
        let status: 'IN STOCK' | 'LOW STOCK' | 'CRITICAL OUT' = 'IN STOCK';
        if (inv.quantity === 0) {
          status = 'CRITICAL OUT';
        } else if (inv.quantity <= inv.reorderLevel) {
          status = 'LOW STOCK';
        }

        return {
          id: inv.id,
          productId: inv.productId,
          productName: inv.product.name,
          sku: inv.product.sku,
          categoryName: inv.product.category.name,
          unitPrice: Number(inv.product.price),
          imageUrl: inv.product.imageUrl,
          storeId: inv.storeId,
          storeName: inv.store.name,
          storeCode: inv.store.code,
          quantity: inv.quantity,
          reservedQuantity: inv.reservedQuantity,
          reorderLevel: inv.reorderLevel,
          status,
          updatedAt: inv.updatedAt.toISOString().substring(0, 10),
        };
      })
      .filter((inv) => {
        if (stockStatus && stockStatus !== 'All') {
          return inv.status === stockStatus;
        }
        return true;
      });

    return apiSuccess(formatted, 'Inventory retrieved successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
