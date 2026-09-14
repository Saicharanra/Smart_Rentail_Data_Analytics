import { PrismaClient, Category } from '@prisma/client';
import { SeededRandom } from '../utils/random';

export const CATEGORIES_MASTER = [
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
  { name: 'Laptops & Computing', slug: 'laptops-computers', description: 'High performance ultrabooks, workstations, and mobile displays' },
  { name: 'Home Appliances', slug: 'home-appliances', description: 'Smart air purifiers, robotic vacuums, and coffee systems' },
  { name: 'Footwear & Apparel', slug: 'footwear-apparel', description: 'Athletic footwear, smart fabrics, and performance outerwear' },
  { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', description: 'Sonic skincare devices, hair styling tech, and grooming kits' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoor', description: 'Camping tech, GPS adventure watches, and fitness gear' },
  { name: 'Groceries & Gourmet', slug: 'groceries-gourmet', description: 'Artisanal roasts, organic superfoods, and pantry essentials' },
  { name: 'Books & Stationery', slug: 'books-stationery', description: 'Tech journals, digital paper tablets, and design publications' },
  { name: 'Automotive Accessories', slug: 'automotive-accessories', description: 'Dashcams, OBD2 diagnostic scanners, and EV chargers' },
  { name: 'Toys & STEM Kits', slug: 'toys-kids', description: 'Programmable robotics, coding kits, and interactive STEM sets' },
  { name: 'Home Decor & Kitchen', slug: 'home-decor-kitchen', description: 'Smart culinary tech, induction cooktops, and interior accents' },
];

export async function generateCategories(
  prisma: PrismaClient,
  count: number,
  random: SeededRandom
): Promise<Category[]> {
  const selected = CATEGORIES_MASTER.slice(0, count);

  const categories: Category[] = [];
  for (const cat of selected) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { description: cat.description },
      create: cat,
    });
    categories.push(created);
  }

  return categories;
}
