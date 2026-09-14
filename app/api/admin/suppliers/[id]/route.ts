import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { updateSupplierSchema } from '@/lib/validations/supplier';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
        products: {
          select: { id: true, name: true, sku: true, price: true, isActive: true },
        },
      },
    });

    if (!supplier) {
      return apiError('Supplier not found', 404);
    }

    return apiSuccess({
      ...supplier,
      productCount: supplier._count.products,
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
    const validated = updateSupplierSchema.parse(body);

    const updated = await prisma.supplier.update({
      where: { id },
      data: {
        ...(validated.name ? { name: validated.name } : {}),
        ...(validated.contactPerson !== undefined ? { contactPerson: validated.contactPerson } : {}),
        ...(validated.email !== undefined ? { email: validated.email } : {}),
        ...(validated.phone !== undefined ? { phone: validated.phone } : {}),
        ...(validated.address !== undefined ? { address: validated.address } : {}),
        ...(validated.category !== undefined ? { category: validated.category } : {}),
        ...(validated.leadTimeDays !== undefined ? { leadTimeDays: validated.leadTimeDays } : {}),
        ...(validated.rating !== undefined ? { rating: validated.rating } : {}),
        ...(validated.status !== undefined ? { status: validated.status } : {}),
      },
    });

    return apiSuccess(updated, 'Supplier updated successfully');
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

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!supplier) {
      return apiError('Supplier not found', 404);
    }

    // Unlink products before deleting supplier safely
    await prisma.product.updateMany({
      where: { supplierId: id },
      data: { supplierId: null },
    });

    await prisma.supplier.delete({ where: { id } });

    return apiSuccess(null, 'Supplier deleted successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
