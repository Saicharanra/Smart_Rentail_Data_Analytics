import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations/auth';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      include: { customer: true },
    });

    if (!user) {
      return apiError('Invalid email or password', 401);
    }

    const isValid = await verifyPassword(validated.password, user.passwordHash);
    if (!isValid) {
      return apiError('Invalid email or password', 401);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return apiSuccess(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          customerId: user.customer?.id,
        },
      },
      'Login successful'
    );
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return apiError('Validation error', 400, err.errors);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
