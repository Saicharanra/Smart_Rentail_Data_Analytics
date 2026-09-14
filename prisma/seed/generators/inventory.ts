import { PrismaClient, Product, Store } from '@prisma/client';
import { SeededRandom } from '../utils/random';

export async function generateInventory(
  prisma: PrismaClient,
  products: Product[],
  stores: Store[],
  random: SeededRandom
): Promise<number> {
  const inventoryData: Array<{
    productId: string;
    storeId: string;
    quantity: number;
    reservedQuantity: number;
    reorderLevel: number;
  }> = [];

  for (const product of products) {
    // Assign products to stores (Online store gets 100% of products; physical stores get ~70% subset)
    for (const store of stores) {
      if (!store.isOnline && random.bool(0.3)) {
        continue; // Skip 30% of physical store product assignments for realism
      }

      // Stock status distribution: 75% IN STOCK, 15% LOW STOCK, 10% OUT OF STOCK
      const statusRoll = random.float(0, 1);
      let quantity = 0;

      if (statusRoll < 0.10) {
        // OUT OF STOCK (10%)
        quantity = 0;
      } else if (statusRoll < 0.25) {
        // LOW STOCK (15%)
        quantity = random.int(1, 10);
      } else {
        // IN STOCK (75%)
        quantity = random.int(15, 250);
      }

      const reservedQuantity = Math.floor(quantity * random.float(0.05, 0.15));

      inventoryData.push({
        productId: product.id,
        storeId: store.id,
        quantity,
        reservedQuantity,
        reorderLevel: 10,
      });
    }
  }

  // Batch insert inventory in chunks of 500
  const chunkSize = 500;
  for (let i = 0; i < inventoryData.length; i += chunkSize) {
    const chunk = inventoryData.slice(i, i + chunkSize);
    await prisma.inventory.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  return inventoryData.length;
}
