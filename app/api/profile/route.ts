import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/permissions/auth-guard';
import { updateProfileSchema } from '@/lib/validations/profile';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            segment: true,
          },
        },
      },
    });

    if (!user) {
      return apiError('User profile not found', 404);
    }

    return apiSuccess(user, 'Customer profile retrieved successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      return apiError(err.message, 401);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const validated = updateProfileSchema.parse(body);

    // 1. Update User name if provided
    if (validated.name) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { name: validated.name },
      });
    }

    // 2. Ensure customer record exists, then update profile info
    let customer = await prisma.customer.findUnique({
      where: { userId: session.userId },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          userId: session.userId,
          phone: validated.phone || null,
          address: validated.address || null,
          city: validated.city || null,
          state: validated.state || null,
          postalCode: validated.postalCode || null,
          country: validated.country || 'USA',
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          phone: validated.phone !== undefined ? validated.phone : customer.phone,
          address: validated.address !== undefined ? validated.address : customer.address,
          city: validated.city !== undefined ? validated.city : customer.city,
          state: validated.state !== undefined ? validated.state : customer.state,
          postalCode: validated.postalCode !== undefined ? validated.postalCode : customer.postalCode,
          country: validated.country !== undefined ? validated.country : customer.country,
        },
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        customer: true,
      },
    });

    return apiSuccess(updatedUser, 'Profile updated successfully');
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      return apiError(err.message, 401);
    }
    if (err.name === 'ZodError') {
      return apiError('Validation error', 400, err.errors);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
