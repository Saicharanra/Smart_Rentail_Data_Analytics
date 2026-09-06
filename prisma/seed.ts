import { PrismaClient, Role, OrderStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Clean existing records
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

  console.log('🧹 Cleaned existing database tables.');

  // 2. Hash default password
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 3. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@retail.bi',
      name: 'System Admin',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  // 4. Create 50+ Customer Users & Profiles
  console.log('👤 Seeding 50+ Customers...');
  const customerProfiles = [];
  const cities = ['Seattle', 'Austin', 'San Francisco', 'Chicago', 'New York', 'Boston', 'Denver', 'Miami'];
  const states = ['WA', 'TX', 'CA', 'IL', 'NY', 'MA', 'CO', 'FL'];

  for (let i = 1; i <= 50; i++) {
    const cityIndex = i % cities.length;
    const user = await prisma.user.create({
      data: {
        email: `customer${i}@example.com`,
        name: `Customer User ${i}`,
        passwordHash,
        role: Role.CUSTOMER,
        customer: {
          create: {
            phone: `+1 (555) ${100 + i}-${2000 + i}`,
            address: `${100 + i} Innovation Way`,
            city: cities[cityIndex],
            state: states[cityIndex],
            postalCode: `${98000 + i}`,
            country: 'USA',
            segment: i <= 10 ? 'VIP' : i <= 35 ? 'Regular' : 'New',
          },
        },
      },
      include: { customer: true },
    });
    if (user.customer) {
      customerProfiles.push(user.customer);
    }
  }

  // 5. Create 10+ Categories
  console.log('📁 Seeding 10+ Categories...');
  const categoriesData = [
    { name: 'Smart Electronics', slug: 'smart-electronics', description: 'Next-gen audio, smart wearables, and IoT tech' },
    { name: 'Workplace & Furniture', slug: 'workplace-furniture', description: 'Ergonomic smart office setups and minimalist workspaces' },
    { name: 'Wearables & Fitness', slug: 'wearables-fitness', description: 'Biometric sensors, smartwatch bands, and health gear' },
    { name: 'Home Automation', slug: 'home-automation', description: 'Connected living sensors, climate control, and smart security' },
    { name: 'Audio & Acoustics', slug: 'audio-acoustics', description: 'Studio monitors, hi-fi headphones, and ANC earbuds' },
    { name: 'Smart Lighting', slug: 'smart-lighting', description: 'RGBIC lightbars, light strips, and Thread mesh ambient lights' },
    { name: 'Networking & Mesh', slug: 'networking-mesh', description: 'Wi-Fi 7 mesh routers and high-speed enterprise switches' },
    { name: 'Mobile Accessories', slug: 'mobile-accessories', description: 'MagSafe wireless chargers, GaN power adapters, and cables' },
    { name: 'Gaming Hardware', slug: 'gaming-hardware', description: 'Mechanical keyboards, lightweight mice, and high-refresh displays' },
    { name: 'Storage & Backup', slug: 'storage-backup', description: 'PCIe 5.0 NVMe SSDs, external RAID arrays, and rugged drives' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories.push(created);
  }

  // 6. Create 10+ Suppliers
  console.log('🏭 Seeding 10+ Suppliers...');
  const suppliersData = [
    { name: 'Apex Audio Tech Ltd', contactPerson: 'Robert Sterling', email: 'supply@apexaudio.io', phone: '+1 (555) 234-8901', category: 'Smart Electronics', leadTimeDays: 4, rating: 4.9 },
    { name: 'Nordic Workspaces Inc', contactPerson: 'Freja Lindqvist', email: 'orders@nordicwork.se', phone: '+46 8 123 4567', category: 'Workplace & Furniture', leadTimeDays: 7, rating: 4.8 },
    { name: 'BioMetrics Global', contactPerson: 'David Chen', email: 'logistics@biometrics.com', phone: '+1 (555) 789-0123', category: 'Wearables & Fitness', leadTimeDays: 5, rating: 4.6 },
    { name: 'LuminaTech Systems', contactPerson: 'Sarah Jenkins', email: 'support@luminatech.io', phone: '+1 (555) 456-7890', category: 'Home Automation', leadTimeDays: 3, rating: 4.7 },
    { name: 'Quantum Gear Corp', contactPerson: 'Michael Chang', email: 'b2b@quantumgear.com', phone: '+1 (555) 987-6543', category: 'Gaming Hardware', leadTimeDays: 6, rating: 4.9 },
    { name: 'AeroGlide Solutions', contactPerson: 'Elena Rostova', email: 'contact@aeroglide.de', phone: '+49 30 9876543', category: 'Workplace & Furniture', leadTimeDays: 8, rating: 4.5 },
    { name: 'CyberPulse Electronics', contactPerson: 'Alex Rivera', email: 'sales@cyberpulse.io', phone: '+1 (555) 321-6547', category: 'Networking & Mesh', leadTimeDays: 4, rating: 4.7 },
    { name: 'Vortex Storage Ltd', contactPerson: 'Kenji Sato', email: 'orders@vortexstorage.jp', phone: '+81 3 1234 5678', category: 'Storage & Backup', leadTimeDays: 5, rating: 4.8 },
    { name: 'Titan Power Systems', contactPerson: 'James O\'Connor', email: 'supply@titanpower.co.uk', phone: '+44 20 7946 0912', category: 'Mobile Accessories', leadTimeDays: 3, rating: 4.6 },
    { name: 'Zenith Acoustic Labs', contactPerson: 'Claire Bennett', email: 'logistics@zenithaudio.fr', phone: '+33 1 42 68 55 00', category: 'Audio & Acoustics', leadTimeDays: 6, rating: 4.9 },
  ];

  const suppliers = [];
  for (const sup of suppliersData) {
    const created = await prisma.supplier.create({ data: sup });
    suppliers.push(created);
  }

  // 7. Create Stores
  console.log('🏪 Seeding Stores...');
  const store1 = await prisma.store.create({
    data: { name: 'Flagship Retail Hub', code: 'STR-SEA-01', address: '700 Fifth Avenue', city: 'Seattle', state: 'WA', zipCode: '98104', isOnline: false },
  });
  const store2 = await prisma.store.create({
    data: { name: 'Downtown Tech Center', code: 'STR-ATX-02', address: '200 Congress Ave', city: 'Austin', state: 'TX', zipCode: '78701', isOnline: false },
  });
  const storeOnline = await prisma.store.create({
    data: { name: 'Online Store Direct Hub', code: 'STR-ONLINE-00', address: '100 Cloud Way', city: 'Seattle', state: 'WA', zipCode: '98101', isOnline: true },
  });
  const stores = [store1, store2, storeOnline];

  // 8. Create 100+ Products & Inventory Records
  console.log('📦 Seeding 100+ Products & Inventory...');
  const products = [];

  for (let i = 1; i <= 100; i++) {
    const category = categories[(i - 1) % categories.length];
    const supplier = suppliers[(i - 1) % suppliers.length];
    const basePrice = Math.floor(29 + (i * 7.5) % 600);
    const costPrice = Math.floor(basePrice * 0.6);

    const product = await prisma.product.create({
      data: {
        sku: `SKU-RET-${1000 + i}`,
        name: `Smart Product ${i} - ${category.name}`,
        slug: `smart-product-${i}`,
        description: `High performance enterprise retail product SKU-${1000 + i} built with precision components and IoT telemetry readiness.`,
        price: basePrice,
        costPrice: costPrice,
        categoryId: category.id,
        supplierId: supplier.id,
        imageUrl: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80`,
        isActive: true,
      },
    });
    products.push(product);

    // Create Inventory per store
    for (const store of stores) {
      const qty = i % 5 === 0 ? Math.floor(Math.random() * 5) : Math.floor(15 + Math.random() * 80);
      await prisma.inventory.create({
        data: {
          productId: product.id,
          storeId: store.id,
          quantity: qty,
          reservedQuantity: Math.floor(qty * 0.1),
          reorderLevel: 10,
        },
      });
    }
  }

  // 9. Create 40+ Orders, OrderItems, Payments, and Reviews
  console.log('🛒 Seeding 40+ Customer Orders, OrderItems & Payments...');
  const statuses = [OrderStatus.DELIVERED, OrderStatus.SHIPPED, OrderStatus.PROCESSING, OrderStatus.PENDING];

  for (let i = 1; i <= 40; i++) {
    const customer = customerProfiles[i % customerProfiles.length];
    const orderStatus = statuses[i % statuses.length];
    const numItems = Math.floor(1 + (i % 4));
    
    let subtotal = 0;
    const itemsData = [];

    for (let j = 0; j < numItems; j++) {
      const product = products[(i * 3 + j) % products.length];
      const qty = Math.floor(1 + (j % 3));
      const price = Number(product.price);
      const itemTotal = price * qty;
      subtotal += itemTotal;

      itemsData.push({
        productId: product.id,
        unitPrice: price,
        quantity: qty,
        totalPrice: itemTotal,
      });
    }

    const tax = subtotal * 0.08;
    const shippingFee = subtotal > 200 ? 0 : 15;
    const totalAmount = subtotal + tax + shippingFee;

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-2026-${9000 + i}`,
        customerId: customer.id,
        storeId: storeOnline.id,
        status: orderStatus,
        subtotal,
        tax,
        shippingFee,
        totalAmount,
        shippingAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.postalCode}`,
        trackingNumber: `TRK-AZU-${9920000 + i}`,
        items: {
          create: itemsData,
        },
        payments: {
          create: {
            amount: totalAmount,
            method: i % 2 === 0 ? 'CREDIT_CARD' : 'APPLE_PAY',
            status: PaymentStatus.COMPLETED,
            transactionId: `TXN-2026-${80000 + i}`,
          },
        },
      },
    });

    // Create product review for completed order items
    if (i <= 25) {
      const firstItem = itemsData[0];
      await prisma.review.create({
        data: {
          customerId: customer.id,
          productId: firstItem.productId,
          rating: 4 + (i % 2),
          title: 'Great smart retail device!',
          comment: `Very satisfied with order ${order.orderNumber}. Fast delivery and excellent build quality.`,
        },
      });
    }
  }

  console.log('✅ Database Seeding Completed Successfully!');
  console.log('------------------------------------------------');
  console.log('🔑 Credentials Created:');
  console.log('   Admin: admin@retail.bi / Password123!');
  console.log('   Customer: customer1@example.com / Password123!');
  console.log('------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error Seeding Database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
