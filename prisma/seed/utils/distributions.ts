import { SeededRandom } from './random';

export interface CategoryPriceConfig {
  min: number;
  max: number;
  mu: number;     // Log-normal mean
  sigma: number;  // Log-normal standard deviation
}

export const CATEGORY_PRICE_RANGES: Record<string, CategoryPriceConfig> = {
  'smart-electronics': { min: 1499, max: 89999, mu: 8.5, sigma: 0.8 },
  'workplace-furniture': { min: 2499, max: 69999, mu: 9.0, sigma: 0.7 },
  'wearables-fitness': { min: 999, max: 34999, mu: 8.0, sigma: 0.6 },
  'home-automation': { min: 799, max: 24999, mu: 7.8, sigma: 0.6 },
  'audio-acoustics': { min: 499, max: 49999, mu: 8.2, sigma: 0.7 },
  'smart-lighting': { min: 399, max: 12999, mu: 7.2, sigma: 0.5 },
  'networking-mesh': { min: 1299, max: 39999, mu: 8.3, sigma: 0.6 },
  'mobile-accessories': { min: 199, max: 4999, mu: 6.5, sigma: 0.5 },
  'gaming-hardware': { min: 1999, max: 129999, mu: 9.2, sigma: 0.8 },
  'storage-backup': { min: 899, max: 45999, mu: 8.1, sigma: 0.6 },
  'laptops-computers': { min: 29999, max: 189999, mu: 10.8, sigma: 0.5 },
  'home-appliances': { min: 1999, max: 79999, mu: 8.8, sigma: 0.7 },
  'footwear-apparel': { min: 499, max: 14999, mu: 7.5, sigma: 0.6 },
  'beauty-personal-care': { min: 299, max: 9999, mu: 6.8, sigma: 0.5 },
  'sports-outdoor': { min: 599, max: 29999, mu: 7.6, sigma: 0.6 },
  'groceries-gourmet': { min: 99, max: 2999, mu: 5.5, sigma: 0.5 },
  'books-stationery': { min: 149, max: 1999, mu: 5.8, sigma: 0.4 },
  'automotive-accessories': { min: 499, max: 19999, mu: 7.4, sigma: 0.6 },
  'toys-kids': { min: 299, max: 8999, mu: 6.7, sigma: 0.5 },
  'home-decor-kitchen': { min: 399, max: 15999, mu: 7.1, sigma: 0.6 },
};

export function generateRealisticPrice(
  categorySlug: string,
  random: SeededRandom
): { price: number; costPrice: number } {
  const config = CATEGORY_PRICE_RANGES[categorySlug] || { min: 299, max: 29999, mu: 7.5, sigma: 0.6 };
  
  // Log-normal distribution
  let rawPrice = random.logNormal(config.mu, config.sigma);
  rawPrice = Math.max(config.min, Math.min(config.max, rawPrice));
  
  // Round to psychological pricing e.g. ₹X,999 or ₹X,499 or ₹X,99
  const price = Math.round(rawPrice / 10) * 10 - 1;
  const costRatio = random.float(0.55, 0.72); // 28% - 45% margin
  const costPrice = Math.round(price * costRatio);

  return {
    price: Math.max(99, price),
    costPrice: Math.max(50, costPrice),
  };
}

// Order Item Count Distribution per Order
export function getOrderItemCount(random: SeededRandom): number {
  // 1 item: 50%, 2 items: 30%, 3 items: 12%, 4 items: 5%, 5+ items: 3%
  return random.weightedChoice([1, 2, 3, 4, 5], [50, 30, 12, 5, 3]);
}

// Item Quantity Distribution per Line Item
export function getItemQuantity(categorySlug: string, random: SeededRandom): number {
  if (['groceries-gourmet', 'books-stationery', 'mobile-accessories'].includes(categorySlug)) {
    return random.weightedChoice([1, 2, 3, 4, 5], [60, 25, 10, 3, 2]);
  }
  // High value electronics / laptops
  return random.weightedChoice([1, 2], [92, 8]);
}
