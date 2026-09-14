import { PrismaClient } from '@prisma/client';
import { getSeedConfig } from './seed/config';
import { SeededRandom } from './seed/utils/random';
import { generateCategories } from './seed/generators/categories';
import { generateSuppliers } from './seed/generators/suppliers';
import { generateStores } from './seed/generators/stores';
import { generateUsersAndCustomers } from './seed/generators/users';
import { generateProducts } from './seed/generators/products';
import { generateInventory } from './seed/generators/inventory';
import { generateOrders } from './seed/generators/orders';
import { generateReviews } from './seed/generators/reviews';
import { validateSeededDatabase } from './seed/validate';

const prisma = new PrismaClient();

async function main() {
  const startTime = Date.now();
  const config = getSeedConfig();
  const random = new SeededRandom(config.randomSeed);

  console.log('====================================================');
  console.log(`🚀 STARTING RETAIL DATA GENERATION [Preset: ${config.size.toUpperCase()}]`);
  console.log('====================================================');
  console.log(`• Random Seed: ${config.randomSeed}`);
  console.log(`• Date Range:  ${config.startDate.toISOString().substring(0, 10)} → ${config.endDate.toISOString().substring(0, 10)}`);
  console.log(`• Targets:     ${config.counts.customers} Customers | ${config.counts.products} Products | ${config.counts.orders} Orders`);
  console.log('====================================================\n');

  // 1. Clean existing records in reverse dependency order
  console.log('🧹 Cleaning existing database tables...');
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Database cleaned successfully.\n');

  // 2. Generate Categories
  console.log(`📁 Generating ${config.counts.categories} Categories...`);
  const categories = await generateCategories(prisma, config.counts.categories, random);
  console.log(`✓ Created ${categories.length} categories.`);

  // 3. Generate Suppliers
  console.log(`🏭 Generating ${config.counts.suppliers} Suppliers...`);
  const categoryNames = categories.map((c) => c.name);
  const suppliers = await generateSuppliers(prisma, config.counts.suppliers, categoryNames, random);
  console.log(`✓ Created ${suppliers.length} suppliers.`);

  // 4. Generate Stores
  console.log(`🏪 Generating ${config.counts.stores} Stores...`);
  const stores = await generateStores(prisma, config.counts.stores, random);
  console.log(`✓ Created ${stores.length} stores.`);

  // 5. Generate Users & Customers
  console.log(`👤 Generating Admin & ${config.counts.customers} Customers...`);
  const { adminUser, customerProfiles } = await generateUsersAndCustomers(prisma, config.counts.customers, random);
  console.log(`✓ Created 1 Admin & ${customerProfiles.length} customer profiles.`);

  // 6. Generate Products
  console.log(`📦 Generating ${config.counts.products} Products...`);
  const products = await generateProducts(prisma, config.counts.products, categories, suppliers, random);
  console.log(`✓ Created ${products.length} products.`);

  // 7. Generate Inventory Matrix
  console.log('🏬 Generating Inventory Stock Matrix...');
  const inventoryCount = await generateInventory(prisma, products, stores, random);
  console.log(`✓ Created ${inventoryCount} inventory stock items.`);

  // 8. Generate Orders, OrderItems & Payments
  console.log(`🛒 Generating ${config.counts.orders} Historical Orders & Payments...`);
  const orderResult = await generateOrders(
    prisma,
    config.counts.orders,
    customerProfiles,
    products,
    stores,
    config.startDate,
    config.endDate,
    random
  );
  console.log(`✓ Created ${orderResult.ordersCount} orders, ${orderResult.orderItemsCount} items, and ${orderResult.paymentsCount} payments.`);

  // 9. Generate Product Reviews
  console.log(`⭐ Generating ${config.counts.reviews} Verified Product Reviews...`);
  const reviewCount = await generateReviews(prisma, config.counts.reviews, orderResult.createdOrders, random);
  console.log(`✓ Created ${reviewCount} product reviews.`);

  // 10. Post-generation Data Quality Validation
  console.log('\n🔍 Running Post-Generation Data Quality Validation...');
  const report = await validateSeededDatabase(prisma);
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n====================================================');
  console.log('        RETAIL DATA GENERATION SUMMARY REPORT       ');
  console.log('====================================================');
  console.log(` Preset Size:       ${config.size.toUpperCase()}`);
  console.log(` Execution Time:    ${elapsedTime}s`);
  console.log(` Random Seed:       ${config.randomSeed}`);
  console.log(` Date Span:         ${report.metrics.earliestOrderDate} → ${report.metrics.latestOrderDate}`);
  console.log('----------------------------------------------------');
  console.log(` Users:             ${report.counts.users.toLocaleString()}`);
  console.log(` Customers:         ${report.counts.customers.toLocaleString()}`);
  console.log(` Categories:        ${report.counts.categories.toLocaleString()}`);
  console.log(` Suppliers:         ${report.counts.suppliers.toLocaleString()}`);
  console.log(` Stores:            ${report.counts.stores.toLocaleString()}`);
  console.log(` Products:          ${report.counts.products.toLocaleString()} (Prices: ₹${report.metrics.minPrice.toLocaleString()} - ₹${report.metrics.maxPrice.toLocaleString()})`);
  console.log(` Inventory Matrix:  ${report.counts.inventory.toLocaleString()}`);
  console.log(` Orders:            ${report.counts.orders.toLocaleString()} (Totals: ₹${report.metrics.minOrderTotal.toLocaleString()} - ₹${report.metrics.maxOrderTotal.toLocaleString()})`);
  console.log(` Order Items:       ${report.counts.orderItems.toLocaleString()}`);
  console.log(` Payments:          ${report.counts.payments.toLocaleString()}`);
  console.log(` Reviews:           ${report.counts.reviews.toLocaleString()}`);
  console.log('----------------------------------------------------');
  console.log(` Orphan Customers:  ${report.checks.orphanCustomers}`);
  console.log(` Negative Stock:    ${report.checks.negativeInventory}`);
  console.log('====================================================');
  console.log('🔑 Credentials Created:');
  console.log('   Admin:    admin@retail.bi / Password123!');
  console.log('   Customer: customer1@retail.bi / Password123!');
  console.log('====================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error Generating Data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
