import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      include: {
        product: { select: { name: true, sku: true, category: { select: { name: true } } } },
        store: { select: { name: true, code: true } },
      },
      orderBy: { quantity: 'asc' },
    });

    const lowStock = inventoryItems
      .filter((inv) => inv.quantity <= inv.reorderLevel)
      .map((inv) => ({
        id: inv.id,
        productName: inv.product.name,
        sku: inv.product.sku,
        category: inv.product.category.name,
        currentStock: inv.quantity,
        reorderLevel: inv.reorderLevel,
        storeName: inv.store.name,
        status: inv.quantity === 0 ? 'Out of Stock' : 'Low Stock',
      }));

    return apiSuccess(lowStock, 'Low stock inventory alerts retrieved');
  } catch (err: any) {
    return apiError(err.message || 'Internal server error', 500);
  }
}
