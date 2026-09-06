import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { createProductSchema } from '@/lib/validations/product';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const sortBy = searchParams.get('sortBy') || 'newest';

    const where: any = {
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(categoryId
        ? { categoryId }
        : category && category !== 'All'
        ? { category: { name: { equals: category, mode: 'insensitive' } } }
        : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    };

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price-asc') orderBy = { price: 'asc' };
    if (sortBy === 'price-desc') orderBy = { price: 'desc' };
    if (sortBy === 'name') orderBy = { name: 'asc' };

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
      return {
        ...p,
        price: Number(p.price),
        costPrice: p.costPrice ? Number(p.costPrice) : null,
        totalStock,
        reviewCount: p._count.reviews,
      };
    });

    return apiSuccess(formattedProducts, 'Products retrieved successfully', 200, {
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      limit,
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
