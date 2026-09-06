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
        return apiError('Customer profile required', 400);
      }
      whereClause.customerId = session.customerId;
    }

    if (statusFilter) {
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
      items: o.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.imageUrl || '',
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

    // 1. Resolve customer ID
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

    // 2. Validate products and stock
    const productIds = validated.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { inventoryItems: true },
    });

    if (products.length !== productIds.length) {
      return apiError('One or more selected products are invalid or inactive', 400);
    }

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

      const totalStock = product.inventoryItems.reduce((sum, inv) => sum + inv.quantity, 0);
      if (totalStock < item.quantity) {
        return apiError(
          `Insufficient stock for "${product.name}". Available: ${totalStock}, Requested: ${item.quantity}`,
          400
        );
      }

      orderItemsData.push({
        productId: product.id,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    const tax = subtotal * 0.08;
    const shippingFee = subtotal > 200 ? 0 : 15;
    const totalAmount = subtotal + tax + shippingFee;

    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Perform atomic Prisma $transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          storeId: validated.storeId,
          status: 'PROCESSING',
          subtotal,
          tax,
          shippingFee,
          totalAmount,
          shippingAddress: validated.shippingAddress,
          trackingNumber: `TRK-AZU-${Math.floor(1000000 + Math.random() * 9000000)}`,
          items: {
            create: orderItemsData,
          },
          payments: {
            create: {
              amount: totalAmount,
              method: validated.paymentMethod,
              status: 'COMPLETED',
              transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            },
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });

      // Deduct inventory
      for (const item of validated.items) {
        const inv = await tx.inventory.findFirst({
          where: { productId: item.productId },
        });

        if (inv) {
          await tx.inventory.update({
            where: { id: inv.id },
            data: {
              quantity: { decrement: item.quantity },
            },
          });
        }
      }

      return newOrder;
    });

    return apiSuccess(
      {
        ...result,
        subtotal: Number(result.subtotal),
        tax: Number(result.tax),
        shippingFee: Number(result.shippingFee),
        totalAmount: Number(result.totalAmount),
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
    return apiError(err.message || 'Internal server error', 500);
  }
}
