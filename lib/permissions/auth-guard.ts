import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { verifyToken } from '../auth';
import { prisma } from '../prisma';

export interface AuthSessionUser {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  customerId?: string;
}

export async function getAuthSession(req: NextRequest): Promise<AuthSessionUser | null> {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (decoded) {
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { customer: true },
      });
      if (dbUser) {
        return {
          userId: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          customerId: dbUser.customer?.id,
        };
      }
    }
  }

  // Check NextAuth session token cookie
  try {
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'supersecret_jwt_auth_key_123456789';
    const nextAuthToken = await getToken({ req, secret });
    if (nextAuthToken && nextAuthToken.userId) {
      const dbUser = await prisma.user.findUnique({
        where: { id: nextAuthToken.userId as string },
        include: { customer: true },
      });
      if (dbUser) {
        return {
          userId: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          customerId: dbUser.customer?.id,
        };
      }
    }
  } catch {
    // Ignore cookie read error
  }

  // Development Fallback: Return first ADMIN user in dev mode if unauthenticated
  if (process.env.NODE_ENV === 'development') {
    const devAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      include: { customer: true },
    });
    if (devAdmin) {
      return {
        userId: devAdmin.id,
        email: devAdmin.email,
        role: devAdmin.role,
        customerId: devAdmin.customer?.id,
      };
    }
  }

  return null;
}

export async function requireAuth(req: NextRequest): Promise<AuthSessionUser> {
  const user = await getAuthSession(req);
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdmin(req: NextRequest): Promise<AuthSessionUser> {
  const user = await requireAuth(req);
  if (user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return user;
}
