import { PrismaClient, Customer, Product, Store, OrderStatus, PaymentStatus } from '@prisma/client';
import { SeededRandom } from '../utils/random';
import { generateOrderTimestamp, getSeasonalMultiplier } from '../utils/dates';
import { getOrderItemCount, getItemQuantity } from '../utils/distributions';

export interface GeneratedOrderResult {
  ordersCount: number;
  orderItemsCount: number;
  paymentsCount: number;
  createdOrders: Array<{ id: string; customerId: string; status: OrderStatus; items: Array<{ productId: string; quantity: number }> }>;
}

export async function generateOrders(
  prisma: PrismaClient,
  orderCount: number,
  customers: Customer[],
  products: Product[],
  stores: Store[],
  startDate: Date,
  endDate: Date,
  random: SeededRandom
): Promise<GeneratedOrderResult> {
  const onlineStore = stores.find((s) => s.isOnline) || stores[0];

  // 1. Assign Customer Purchase Frequency Tiers (RFM Analytics Readiness)
  // ~10% Inactive (0 orders), ~30% Occasional, ~50% Regular, ~10% Frequent
  const activeCustomers = random.shuffle([...customers]);
  const inactiveCutoff = Math.floor(activeCustomers.length * 0.10);
  const purchasingCustomers = activeCustomers.slice(inactiveCutoff);

  const customerWeights = purchasingCustomers.map((_, idx) => {
    if (idx < purchasingCustomers.length * 0.15) return 10; // High frequency
    if (idx < purchasingCustomers.length * 0.65) return 3;  // Medium frequency
    return 1;                                              // Low frequency
  });

  const statuses = [
    OrderStatus.DELIVERED,
    OrderStatus.SHIPPED,
    OrderStatus.PROCESSING,
    OrderStatus.PENDING,
    OrderStatus.CANCELLED,
  ];
  const statusWeights = [70, 15, 8, 4, 3]; // 70% Delivered, 15% Shipped, 8% Processing, 4% Pending, 3% Cancelled

  const paymentMethods = ['CREDIT_CARD', 'APPLE_PAY', 'PAYPAL'];
  const paymentWeights = [60, 25, 15];

  const createdOrdersSummary: Array<{ id: string; customerId: string; status: OrderStatus; items: Array<{ productId: string; quantity: number }> }> = [];

  let ordersCount = 0;
  let orderItemsCount = 0;
  let paymentsCount = 0;

  // Process in chunks of 500 orders
  const chunkSize = 500;
  for (let i = 0; i < orderCount; i += chunkSize) {
    const currentChunkSize = Math.min(chunkSize, orderCount - i);

    for (let j = 0; j < currentChunkSize; j++) {
      const orderIdx = i + j + 1;
      const customer = random.weightedChoice(purchasingCustomers, customerWeights);
      const createdAt = generateOrderTimestamp(startDate, endDate, random);

      // Determine order items count
      const numItems = getOrderItemCount(random);
      const chosenProducts = random.shuffle([...products]).slice(0, numItems);

      let subtotal = 0;
      const itemsData: Array<{
        productId: string;
        unitPrice: number;
        quantity: number;
        totalPrice: number;
      }> = [];

      for (const prod of chosenProducts) {
        const qty = getItemQuantity(prod.categoryId, random);
        
        // Simulate historical price variation (e.g. 90% - 105% of current price at purchase time)
        const priceVariation = random.float(0.92, 1.05);
        const unitPrice = Math.round(Number(prod.price) * priceVariation * 100) / 100;
        const totalPrice = Math.round(unitPrice * qty * 100) / 100;
        subtotal += totalPrice;

        itemsData.push({
          productId: prod.id,
          unitPrice,
          quantity: qty,
          totalPrice,
        });
      }

      subtotal = Math.round(subtotal * 100) / 100;
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      const shippingFee = subtotal >= 200 ? 0 : 15;
      const totalAmount = Math.round((subtotal + tax + shippingFee) * 100) / 100;

      const status = random.weightedChoice(statuses, statusWeights);
      const orderNumber = `ORD-${createdAt.getUTCFullYear()}-${100000 + orderIdx}`;
      const trackingNumber = `TRK-AZU-${9000000 + orderIdx}`;

      const paymentMethod = random.weightedChoice(paymentMethods, paymentWeights);
      const paymentStatus = status === OrderStatus.CANCELLED ? PaymentStatus.REFUNDED : PaymentStatus.COMPLETED;

      // Select store (90% Online, 10% Physical Store)
      const store = random.bool(0.9) ? onlineStore : random.choice(stores);

      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          storeId: store.id,
          status,
          subtotal,
          tax,
          shippingFee,
          totalAmount,
          shippingAddress: `${customer.address || '742 Evergreen Terrace'}, ${customer.city || 'Hyderabad'}, ${customer.state || 'Telangana'} ${customer.postalCode || '500032'}`,
          trackingNumber,
          createdAt,
          updatedAt: createdAt,
          items: {
            create: itemsData.map((item) => ({
              productId: item.productId,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              createdAt,
              updatedAt: createdAt,
            })),
          },
          payments: {
            create: {
              amount: totalAmount,
              method: paymentMethod,
              status: paymentStatus,
              transactionId: `TXN-${createdAt.getTime()}-${orderIdx}`,
              createdAt,
              updatedAt: createdAt,
            },
          },
        },
        include: {
          items: true,
        },
      });

      ordersCount++;
      orderItemsCount += order.items.length;
      paymentsCount++;

      // Retain sample of created orders for reviews generator
      if (status === OrderStatus.DELIVERED && createdOrdersSummary.length < 5000) {
        createdOrdersSummary.push({
          id: order.id,
          customerId: customer.id,
          status,
          items: order.items.map((it) => ({ productId: it.productId, quantity: it.quantity })),
        });
      }
    }
  }

  return {
    ordersCount,
    orderItemsCount,
    paymentsCount,
    createdOrders: createdOrdersSummary,
  };
}
