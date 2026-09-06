import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const categorySales = [
      { name: 'Smart Electronics', sales: 485000, percentage: 38 },
      { name: 'Workplace & Furniture', sales: 342000, percentage: 27 },
      { name: 'Wearables & Fitness', sales: 270000, percentage: 21 },
      { name: 'Home Automation', sales: 178000, percentage: 14 },
    ];
    

    return apiSuccess(categorySales, 'Category performance analytics retrieved');
  } catch (err: any) {
    return apiError(err.message || 'Internal server error', 500);
  }
}
