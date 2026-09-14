import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { createSupplierSchema } from '@/lib/validations/supplier';
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
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const suppliers = await prisma.supplier.findMany({
      where: whereClause,
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { rating: 'desc' },
    });

    const formatted = suppliers.map((sup) => ({
      id: sup.id,
      name: sup.name,
      contactPerson: sup.contactPerson || 'N/A',
      email: sup.email || 'N/A',
      phone: sup.phone || 'N/A',
      address: sup.address || 'N/A',
      category: sup.category || 'General Electronics',
      leadTimeDays: sup.leadTimeDays,
      rating: sup.rating,
      status: sup.status,
      productCount: sup._count.products,
      createdAt: sup.createdAt.toISOString().substring(0, 10),
    }));

    return apiSuccess(formatted, 'Suppliers retrieved successfully');
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
    const validated = createSupplierSchema.parse(body);

    const supplier = await prisma.supplier.create({
      data: {
        name: validated.name,
        contactPerson: validated.contactPerson || null,
        email: validated.email || null,
        phone: validated.phone || null,
        address: validated.address || null,
        category: validated.category || 'General Electronics',
        leadTimeDays: validated.leadTimeDays || 5,
        rating: validated.rating || 4.5,
        status: validated.status || 'Active',
      },
    });

    return apiSuccess(supplier, 'Supplier created successfully', 201);
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
