import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        totalPrice: true,
      },
      orderBy: {
        _sum: {
          totalPrice: 'desc',
        },
      },
      take: 5,
    });

    const productIds = topProducts.map((p) => p.productId);
    const productsDetails = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sku: true, imageUrl: true, price: true },
    });

    const formatted = topProducts.map((item) => {
      const details = productsDetails.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        name: details?.name || 'Product',
        sku: details?.sku || 'N/A',
        imageUrl: details?.imageUrl || '',
        unitsSold: item._sum.quantity || 0,
        totalRevenue: Number(item._sum.totalPrice || 0),
      };
    });

    return apiSuccess(formatted, 'Top performing products analytics retrieved');
  } catch (err: any) {
    return apiError(err.message || 'Internal server error', 500);
  }
}
