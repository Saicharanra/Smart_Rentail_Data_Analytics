import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/permissions/auth-guard';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return apiError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        customer: true,
      },
    });

    return apiSuccess(user, 'User profile fetched successfully');
  } catch (err: any) {
    return apiError(err.message || 'Internal server error', 500);
  }
}
