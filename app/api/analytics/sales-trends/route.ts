import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const monthlyTrends = [
      { month: 'Jan', revenue: 142000, orders: 1240, target: 130000 },
      { month: 'Feb', revenue: 158000, orders: 1380, target: 140000 },
      { month: 'Mar', revenue: 189000, orders: 1650, target: 150000 },
      { month: 'Apr', revenue: 176000, orders: 1520, target: 160000 },
      { month: 'May', revenue: 210000, orders: 1840, target: 175000 },
      { month: 'Jun', revenue: 245000, orders: 2150, target: 190000 },
      { month: 'Jul', revenue: 232000, orders: 2010, target: 200000 },
      { month: 'Aug', revenue: 278000, orders: 2420, target: 220000 },
      { month: 'Sep', revenue: 312000, orders: 2750, target: 250000 },
    ];

    return apiSuccess(monthlyTrends, 'Sales trend analytics retrieved successfully');
  } catch (err: any) {
    return apiError(err.message || 'Internal server error', 500);
  }
}
