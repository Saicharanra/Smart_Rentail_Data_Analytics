import { NextRequest } from 'next/server';
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
