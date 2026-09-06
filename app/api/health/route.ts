import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Perform a lightweight query ($queryRaw) to verify database connectivity
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'online',
        database: 'connected',
        timestamp: new Date().toISOString(),
        message: 'PostgreSQL database connection is active and healthy.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      {
        status: 'offline',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        error: error.message || 'Failed to connect to PostgreSQL database.',
        hint: 'Please check your DATABASE_URL in .env file and ensure PostgreSQL server is running.',
      },
      { status: 500 }
    );
  }
}
