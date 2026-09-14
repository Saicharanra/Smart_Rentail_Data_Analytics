import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { createStoreSchema } from '@/lib/validations/store';
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
        { code: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    const stores = await prisma.store.findMany({
      where: whereClause,
      include: {
        _count: { select: { inventoryItems: true, orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = stores.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      address: s.address,
      city: s.city,
      state: s.state,
      zipCode: s.zipCode,
      isOnline: s.isOnline,
      inventoryCount: s._count.inventoryItems,
      ordersCount: s._count.orders,
      createdAt: s.createdAt.toISOString().substring(0, 10),
    }));

    return apiSuccess(formatted, 'Stores retrieved successfully');
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
    const validated = createStoreSchema.parse(body);

    const store = await prisma.store.create({
      data: {
        name: validated.name,
        code: validated.code,
        address: validated.address,
        city: validated.city,
        state: validated.state,
        zipCode: validated.zipCode,
        isOnline: validated.isOnline !== undefined ? validated.isOnline : false,
      },
    });

    return apiSuccess(store, 'Store created successfully', 201);
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
