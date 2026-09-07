import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'supersecret_jwt_auth_key_123456789';

  // Protect /admin routes - require ADMIN role
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret });

    // If next-auth session token exists and role is not ADMIN, redirect to customer profile
    if (token && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
