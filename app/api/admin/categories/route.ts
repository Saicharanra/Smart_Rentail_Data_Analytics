import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { createCategorySchema } from '@/lib/validations/category';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      productCount: cat._count.products,
      createdAt: cat.createdAt.toISOString().substring(0, 10),
    }));

    return apiSuccess(formatted, 'Categories retrieved successfully');
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
    const validated = createCategorySchema.parse(body);

    const slug = validated.slug || validated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await prisma.category.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description || null,
        imageUrl: validated.imageUrl || null,
      },
    });

    return apiSuccess(category, 'Category created successfully', 201);
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
