import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { createInventorySchema } from '@/lib/validations/inventory';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lowStockOnly = searchParams.get('lowStock') === 'true';
    const storeId = searchParams.get('storeId') || undefined;

    const inventory = await prisma.inventory.findMany({
      where: {
        ...(storeId ? { storeId } : {}),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: { select: { name: true } },
            supplier: { select: { name: true } },
          },
        },
        store: { select: { id: true, name: true, code: true } },
      },
      orderBy: { quantity: 'asc' },
    });

    const formatted = inventory
      .map((inv) => {
        const isLowStock = inv.quantity <= inv.reorderLevel;
        return {
          id: inv.id,
          productId: inv.productId,
          productName: inv.product.name,
          sku: inv.product.sku,
          category: inv.product.category.name,
          supplierName: inv.product.supplier?.name || 'N/A',
          storeId: inv.storeId,
          storeName: inv.store.name,
          currentStock: inv.quantity,
          reservedStock: inv.reservedQuantity,
          reorderPoint: inv.reorderLevel,
          status: inv.quantity === 0 ? 'Critical Out' : isLowStock ? 'Low Stock' : 'Healthy',
          updatedAt: inv.updatedAt,
        };
      })
      .filter((inv) => (!lowStockOnly ? true : inv.currentStock <= inv.reorderPoint));

    return apiSuccess(formatted, 'Inventory records retrieved successfully');
  } catch (err: any) {
    return apiError(err.message || 'Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const body = await req.json();
    const validated = createInventorySchema.parse(body);

    const existing = await prisma.inventory.findUnique({
      where: {
        productId_storeId: {
          productId: validated.productId,
          storeId: validated.storeId,
        },
      },
    });

    if (existing) {
      return apiError('Inventory record already exists for this product in this store', 400);
    }

    const inventory = await prisma.inventory.create({
      data: validated,
      include: { product: true, store: true },
    });

    return apiSuccess(inventory, 'Inventory created successfully', 201);
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
