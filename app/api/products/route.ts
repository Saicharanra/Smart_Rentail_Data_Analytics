import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { createProductSchema } from '@/lib/validations/product';
import { apiSuccess, apiError } from '@/lib/utils/api-response';
import { getInventoryStatus } from '@/lib/constants/inventory';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const supplierId = searchParams.get('supplierId') || '';
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const sortBy = searchParams.get('sortBy') || 'newest';

    const where: any = {
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { category: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
      ...(categoryId && categoryId !== 'All'
        ? { categoryId }
        : category && category !== 'All'
        ? { category: { name: { equals: category, mode: 'insensitive' } } }
        : {}),
      ...(supplierId && supplierId !== 'All' ? { supplierId } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && !isNaN(minPrice) ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined && !isNaN(maxPrice) ? { lte: maxPrice } : {}),
            },
          }
        : {}),
      ...(inStockOnly
        ? {
            inventoryItems: {
              some: { quantity: { gt: 0 } },
            },
          }
        : {}),
    };

    // Whitelisted Sort Options
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price-asc' || sortBy === 'price_asc') orderBy = { price: 'asc' };
    else if (sortBy === 'price-desc' || sortBy === 'price_desc') orderBy = { price: 'desc' };
    else if (sortBy === 'name' || sortBy === 'name-asc' || sortBy === 'name_asc') orderBy = { name: 'asc' };
    else if (sortBy === 'name-desc' || sortBy === 'name_desc') orderBy = { name: 'desc' };
    else if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          supplier: { select: { id: true, name: true } },
          inventoryItems: { select: { quantity: true, reorderLevel: true } },
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((p) => {
      const totalStock = p.inventoryItems.reduce((sum, inv) => sum + inv.quantity, 0);
      const minReorder = p.inventoryItems.length > 0 ? Math.min(...p.inventoryItems.map((i) => i.reorderLevel)) : 10;
      const stockStatus = getInventoryStatus(totalStock, minReorder);

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        costPrice: p.costPrice ? Number(p.costPrice) : null,
        imageUrl: p.imageUrl,
        isActive: p.isActive,
        categoryId: p.categoryId,
        categoryName: p.category.name,
        categorySlug: p.category.slug,
        supplierId: p.supplierId,
        supplierName: p.supplier?.name || null,
        totalStock,
        stockStatus,
        reviewCount: p._count.reviews,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    return apiSuccess(formattedProducts, 'Products retrieved successfully', 200, {
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit) || 1,
    });
  } catch (err: any) {
    return apiError(err.message || 'Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const body = await req.json();
    const validated = createProductSchema.parse(body);

    const existing = await prisma.product.findFirst({
      where: { OR: [{ sku: validated.sku }, { slug: validated.slug }] },
    });

    if (existing) {
      return apiError('Product with this SKU or slug already exists', 400);
    }

    const product = await prisma.product.create({
      data: {
        sku: validated.sku,
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        price: validated.price,
        costPrice: validated.costPrice,
        categoryId: validated.categoryId,
        supplierId: validated.supplierId,
        imageUrl: validated.imageUrl,
        isActive: validated.isActive,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    // Automatically initialize online inventory if an online store exists
    const onlineStore = await prisma.store.findFirst({ where: { isOnline: true } });
    if (onlineStore) {
      await prisma.inventory.create({
        data: {
          productId: product.id,
          storeId: onlineStore.id,
          quantity: validated.stock !== undefined ? validated.stock : 50,
          reorderLevel: 10,
        },
      });
    }

    return apiSuccess(
      {
        ...product,
        price: Number(product.price),
        costPrice: product.costPrice ? Number(product.costPrice) : null,
      },
      'Product created successfully',
      201
    );
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
