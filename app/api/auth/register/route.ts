import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validations/auth';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return apiError('User with this email already exists', 400);
    }

    const passwordHash = await hashPassword(validated.password);
    // Newly registered users strictly default to CUSTOMER role (public selection of ADMIN is prohibited)
    const role = 'CUSTOMER';

    // Construct Prisma create payload safely
    const userData: any = {
      email: validated.email,
      name: validated.name,
      passwordHash,
      role: role,
    };

    // If role is CUSTOMER, create linked Customer profile record
    if (role === 'CUSTOMER') {
      userData.customer = {
        create: {
          phone: validated.phone || null,
          address: validated.address || null,
          city: validated.city || null,
          state: validated.state || null,
          postalCode: validated.postalCode || null,
          country: validated.country || 'USA',
          segment: 'New',
        },
      };
    }

    const user = await prisma.user.create({
      data: userData,
      include: {
        customer: true,
      },
    });

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
      'User registered and saved to database successfully',
      201
    );
  } catch (err: any) {
    console.error('Error registering user in database:', err);

    if (err.name === 'ZodError') {
      return apiError('Validation error', 400, err.errors);
    }
    return apiError(err.message || 'Internal server error while saving user to database', 500);
  }
}
