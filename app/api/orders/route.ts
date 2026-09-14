import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getAuthSession } from '@/lib/permissions/auth-guard';
import { createOrderSchema } from '@/lib/validations/order';
import { apiSuccess, apiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    let whereClause: any = {};
    if (session?.role === 'CUSTOMER') {
      if (!session.customerId) {
        return apiError('Customer profile required to view orders', 400);
      }
      whereClause.customerId = session.customerId;
    }

    if (statusFilter && statusFilter !== 'All') {
      whereClause.status = statusFilter;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        customer: {
          include: { user: { select: { name: true, email: true } } },
        },
        items: {
          include: { product: { select: { name: true, imageUrl: true, sku: true } } },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customer.user.name || 'Customer',
      customerEmail: o.customer.user.email,
      date: o.createdAt.toISOString().replace('T', ' ').substring(0, 16),
      status: o.status,
      subtotal: Number(o.subtotal),
      tax: Number(o.tax),
      shippingFee: Number(o.shippingFee),
      total: Number(o.totalAmount),
      shippingAddress: o.shippingAddress,
      trackingNumber: o.trackingNumber,
      paymentMethod: o.payments[0]?.method || 'CREDIT_CARD',
      paymentStatus: o.payments[0]?.status || 'COMPLETED',
      items: o.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.imageUrl || '',
        productSku: item.product.sku,
        price: Number(item.unitPrice),
        quantity: item.quantity,
        total: Number(item.totalPrice),
      })),
    }));

    return apiSuccess(formatted, 'Orders retrieved successfully');
  } catch (err: any) {
    return apiError(err.message || 'Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const validated = createOrderSchema.parse(body);

    // 1. Resolve Customer ID from session or explicitly passed customerId (if admin/system)
    const customerId = validated.customerId || session.customerId;
    if (!customerId) {
      return apiError('Customer profile required to place order', 400);
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      return apiError('Customer record not found', 404);
    }

    // 2. Fetch authoritative product information from database (SERVER-SIDE PRICE SECURITY)
    const productIds = validated.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return apiError('One or more selected products no longer exist.', 400);
    }

    // Check for inactive products (Stale Cart Validation)
    const inactiveProduct = products.find((p) => !p.isActive);
    if (inactiveProduct) {
      return apiError(`Product "${inactiveProduct.name}" is no longer active for purchase.`, 400);
    }

    // Compute server-authoritative line items and totals
    let subtotal = 0;
    const orderItemsData: Array<{
      productId: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }> = [];

    for (const item of validated.items) {
      const product = products.find((p) => p.id === item.productId)!;
      const unitPrice = Number(product.price);
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: product.id,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const shippingFee = subtotal >= 200 ? 0 : 15;
    const totalAmount = subtotal + tax + shippingFee;

    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `TRK-AZU-${Math.floor(1000000 + Math.random() * 9000000)}`;

    // 3. ATOMIC PRISMA $TRANSACTION WITH OVERSELLING & CONCURRENCY PROTECTION
    const result = await prisma.$transaction(async (tx) => {
      // Re-verify stock inside transaction for concurrency safety
      for (const item of validated.items) {
        const product = products.find((p) => p.id === item.productId)!;

        // Fetch all inventory items for this product
        const inventoryRecords = await tx.inventory.findMany({
          where: { productId: item.productId },
        });

        const totalStock = inventoryRecords.reduce((sum, inv) => sum + inv.quantity, 0);

        if (totalStock < item.quantity) {
          throw new Error(
            `Insufficient inventory for "${product.name}". Available: ${totalStock}, Requested: ${item.quantity}`
          );
        }

        // Deduct quantity from primary inventory record (or first available with quantity)
        let remainingToDeduct = item.quantity;
        for (const inv of inventoryRecords) {
          if (remainingToDeduct <= 0) break;
          const deductAmount = Math.min(inv.quantity, remainingToDeduct);
          if (deductAmount > 0) {
            const updated = await tx.inventory.update({
              where: { id: inv.id },
              data: {
                quantity: { decrement: deductAmount },
              },
            });
            if (updated.quantity < 0) {
              throw new Error(`Negative stock prevented for "${product.name}".`);
            }
            remainingToDeduct -= deductAmount;
          }
        }

        if (remainingToDeduct > 0) {
          throw new Error(`Stock deduction failed for "${product.name}".`);
        }
      }

      // Create Order, OrderItems, and Payment record atomically
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          storeId: validated.storeId || null,
          status: 'PROCESSING',
          subtotal,
          tax,
          shippingFee,
          totalAmount,
          shippingAddress: validated.shippingAddress,
          trackingNumber,
          items: {
            create: orderItemsData,
          },
          payments: {
            create: {
              amount: totalAmount,
              method: validated.paymentMethod,
              status: 'COMPLETED',
              transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
            },
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });

      return newOrder;
    });

    return apiSuccess(
      {
        id: result.id,
        orderNumber: result.orderNumber,
        status: result.status,
        subtotal: Number(result.subtotal),
        tax: Number(result.tax),
        shippingFee: Number(result.shippingFee),
        totalAmount: Number(result.totalAmount),
        shippingAddress: result.shippingAddress,
        trackingNumber: result.trackingNumber,
        createdAt: result.createdAt.toISOString(),
      },
      'Order placed successfully and inventory updated',
      201
    );
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      return apiError(err.message, err.message === 'UNAUTHORIZED' ? 401 : 403);
    }
    if (err.name === 'ZodError') {
      return apiError('Validation error', 400, err.errors);
    }
    // Return explicit stock / transaction validation error message
    if (err.message && (err.message.includes('Insufficient inventory') || err.message.includes('Negative stock'))) {
      return apiError(err.message, 400);
    }
    return apiError(err.message || 'Internal server error', 500);
  }
}
