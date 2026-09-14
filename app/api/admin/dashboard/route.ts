import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions/auth-guard';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    // 1. Count aggregates
    const [
      totalCustomers,
      totalProducts,
      totalOrders,
      revenueAggregate,
      pendingOrders,
      completedOrders,
      inventoryItems,
      recentOrders,
      categoriesWithProducts
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _avg: { totalAmount: true },
      }),
      prisma.order.count({ where: { status: { in: ['PENDING', 'PROCESSING'] } } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.inventory.findMany({
        include: {
          product: { select: { id: true, name: true, sku: true, imageUrl: true } },
          store: { select: { name: true } },
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { include: { user: { select: { name: true, email: true } } } },
        },
      }),
      prisma.category.findMany({
        include: {
          products: {
            select: { id: true, price: true },
          },
        },
      }),
    ]);

    const totalRevenue = Number(revenueAggregate._sum.totalAmount || 0);
    const averageOrderValue = Number(revenueAggregate._avg.totalAmount || 0);

    // 2. Compute stock alert states
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const lowStockProductsList: Array<any> = [];

    for (const inv of inventoryItems) {
      if (inv.quantity === 0) {
        outOfStockCount++;
      } else if (inv.quantity <= inv.reorderLevel) {
        lowStockCount++;
      }

      if (inv.quantity <= inv.reorderLevel) {
        lowStockProductsList.push({
          id: inv.id,
          productId: inv.productId,
          productName: inv.product.name,
          sku: inv.product.sku,
          storeName: inv.store.name,
          currentStock: inv.quantity,
          reorderPoint: inv.reorderLevel,
          status: inv.quantity === 0 ? 'Out of Stock' : 'Low Stock',
        });
      }
    }

    // 3. Format recent orders
    const formattedRecentOrders = recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customer.user.name || 'Customer',
      customerEmail: o.customer.user.email,
      status: o.status,
      total: Number(o.totalAmount),
      date: o.createdAt.toISOString().substring(0, 10),
    }));

    // 4. Category performance
    const categoryPerformance = categoriesWithProducts.map((cat) => ({
      name: cat.name,
      productCount: cat.products.length,
      slug: cat.slug,
    }));

    return apiSuccess(
      {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        averageOrderValue,
        lowStockCount,
        outOfStockCount,
        pendingOrders,
        completedOrders,
        recentOrders: formattedRecentOrders,
        lowStockProducts: lowStockProductsList.slice(0, 5),
        categoryPerformance,
      },
      'Admin dashboard metrics retrieved successfully'
    );
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
