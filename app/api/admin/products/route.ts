import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { createProductSchema } from '@/lib/validations/product';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const supplierId = searchParams.get('supplierId') || '';

    const whereClause: any = {};

    if (categoryId && categoryId !== 'All') {
      whereClause.categoryId = categoryId;
    }

    if (supplierId && supplierId !== 'All') {
      whereClause.supplierId = supplierId;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        supplier: { select: { id: true, name: true } },
        inventoryItems: { select: { quantity: true, reorderLevel: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = products.map((p) => {
      const totalStock = p.inventoryItems.reduce((sum, inv) => sum + inv.quantity, 0);
      const minReorder = p.inventoryItems.length > 0 ? Math.min(...p.inventoryItems.map((i) => i.reorderLevel)) : 10;

      let stockStatus = 'IN STOCK';
      if (totalStock === 0) {
        stockStatus = 'OUT OF STOCK';
      } else if (totalStock <= minReorder) {
        stockStatus = 'LOW STOCK';
      }

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        costPrice: p.costPrice ? Number(p.costPrice) : null,
        categoryId: p.categoryId,
        categoryName: p.category.name,
        categorySlug: p.category.slug,
        supplierId: p.supplierId,
        supplierName: p.supplier?.name || 'N/A',
        imageUrl: p.imageUrl,
        isActive: p.isActive,
        totalStock,
        reorderLevel: minReorder,
        stockStatus,
        createdAt: p.createdAt.toISOString().substring(0, 10),
      };
    });

    return apiSuccess(formatted, 'Products retrieved successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const validated = createProductSchema.parse(body);

    const slug = validated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        sku: validated.sku,
        name: validated.name,
        slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
        description: validated.description,
        price: validated.price,
        costPrice: validated.costPrice || null,
        categoryId: validated.categoryId,
        supplierId: validated.supplierId || null,
        imageUrl: validated.imageUrl || null,
        isActive: validated.isActive !== undefined ? validated.isActive : true,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    // Create default online store inventory if available
    const onlineStore = await prisma.store.findFirst({ where: { isOnline: true } });
    if (onlineStore) {
      await prisma.inventory.create({
        data: {
          productId: product.id,
          storeId: onlineStore.id,
          quantity: validated.stock || 50,
          reorderLevel: 10,
        },
      });
    }

    return apiSuccess(product, 'Product created successfully', 201);
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
