import { PrismaClient, Product, Category, Supplier } from '@prisma/client';
import { SeededRandom } from '../utils/random';
import { generateRealisticPrice } from '../utils/distributions';

const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  'smart-electronics': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
  ],
  'workplace-furniture': [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80',
  ],
  'wearables-fitness': [
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
  ],
  'home-automation': [
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=800&q=80',
  ],
  'laptops-computers': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  ],
};

const GLOBAL_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
];

const ADJECTIVES = ['Ultra', 'Pro', 'Smart', 'Elite', 'NextGen', 'Compact', 'Precision', 'Enterprise', 'Wireless', 'Ergonomic', 'Studio', 'Turbo', 'Quantum', 'Omni', 'Max'];

export async function generateProducts(
  prisma: PrismaClient,
  count: number,
  categories: Category[],
  suppliers: Supplier[],
  random: SeededRandom
): Promise<Product[]> {
  const products: Product[] = [];
  const chunkSize = 200;

  for (let i = 0; i < count; i += chunkSize) {
    const currentChunk = Math.min(chunkSize, count - i);

    for (let j = 0; j < currentChunk; j++) {
      const idx = i + j + 1;
      const category = categories[(idx - 1) % categories.length];
      const supplier = suppliers[(idx - 1) % suppliers.length];
      
      const adj = random.choice(ADJECTIVES);
      const name = `${adj} ${category.name.replace(/&/g, '')} Item ${idx}`;
      const slug = `${category.slug}-item-${idx}`;
      const sku = `SKU-RET-${10000 + idx}`;

      const { price, costPrice } = generateRealisticPrice(category.slug, random);

      const pool = CATEGORY_IMAGE_POOLS[category.slug] || GLOBAL_FALLBACK_IMAGES;
      const imageUrl = pool[idx % pool.length];

      const product = await prisma.product.upsert({
        where: { sku },
        update: { price, costPrice, isActive: true },
        create: {
          sku,
          name,
          slug,
          description: `High performance retail product ${sku} engineered with precision telemetry and telemetry readiness for modern enterprise BI frameworks.`,
          price,
          costPrice,
          categoryId: category.id,
          supplierId: supplier.id,
          imageUrl,
          isActive: true,
        },
      });
      products.push(product);
    }
  }

  return products;
}
