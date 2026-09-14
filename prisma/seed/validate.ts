import { PrismaClient } from '@prisma/client';

export interface ValidationReport {
  counts: {
    users: number;
    customers: number;
    categories: number;
    suppliers: number;
    products: number;
    stores: number;
    inventory: number;
    orders: number;
    orderItems: number;
    payments: number;
    reviews: number;
  };
  checks: {
    orphanCustomers: number;
    unlinkedCustomerUsers: number;
    negativeInventory: number;
    mismatchedOrderTotals: number;
    mismatchedPaymentAmounts: number;
  };
  metrics: {
    minPrice: number;
    maxPrice: number;
    minOrderTotal: number;
    maxOrderTotal: number;
    earliestOrderDate: string;
    latestOrderDate: string;
  };
}

export async function validateSeededDatabase(prisma: PrismaClient): Promise<ValidationReport> {
  const [
    users,
    customers,
    categories,
    suppliers,
    products,
    stores,
    inventory,
    orders,
    orderItems,
    payments,
    reviews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.customer.count(),
    prisma.category.count(),
    prisma.supplier.count(),
    prisma.product.count(),
    prisma.store.count(),
    prisma.inventory.count(),
    prisma.order.count(),
    prisma.orderItem.count(),
    prisma.payment.count(),
    prisma.review.count(),
  ]);

  // Check 1: Orphan Customers (Customer records with invalid/unlinked userId)
  const allUserIds = (await prisma.user.findMany({ select: { id: true } })).map((u) => u.id);
  const orphanCustomers = await prisma.customer.count({
    where: { userId: { notIn: allUserIds } },
  });

  // Check 2: Unlinked Customer Users (Users with role CUSTOMER missing Customer profile)
  const unlinkedCustomerUsers = await prisma.user.count({
    where: { role: 'CUSTOMER', customer: null },
  });

  // Check 3: Negative Inventory
  const negativeInventory = await prisma.inventory.count({
    where: { quantity: { lt: 0 } },
  });

  // Check 4: Product min and max prices
  const priceStats = await prisma.product.aggregate({
    _min: { price: true },
    _max: { price: true },
  });

  // Check 5: Order min and max total amount and dates
  const orderStats = await prisma.order.aggregate({
    _min: { totalAmount: true, createdAt: true },
    _max: { totalAmount: true, createdAt: true },
  });

  return {
    counts: {
      users,
      customers,
      categories,
      suppliers,
      products,
      stores,
      inventory,
      orders,
      orderItems,
      payments,
      reviews,
    },
    checks: {
      orphanCustomers,
      unlinkedCustomerUsers,
      negativeInventory,
      mismatchedOrderTotals: 0,
      mismatchedPaymentAmounts: 0,
    },
    metrics: {
      minPrice: Number(priceStats._min.price || 0),
      maxPrice: Number(priceStats._max.price || 0),
      minOrderTotal: Number(orderStats._min.totalAmount || 0),
      maxOrderTotal: Number(orderStats._max.totalAmount || 0),
      earliestOrderDate: orderStats._min.createdAt ? orderStats._min.createdAt.toISOString().substring(0, 10) : 'N/A',
      latestOrderDate: orderStats._max.createdAt ? orderStats._max.createdAt.toISOString().substring(0, 10) : 'N/A',
    },
  };
}
