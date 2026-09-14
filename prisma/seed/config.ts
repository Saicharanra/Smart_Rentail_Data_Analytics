export type SeedSize = 'small' | 'medium' | 'large';

export interface SeedConfig {
  size: SeedSize;
  randomSeed: number;
  startDate: Date;
  endDate: Date;
  counts: {
    users: number;
    customers: number;
    categories: number;
    suppliers: number;
    stores: number;
    products: number;
    orders: number;
    reviews: number;
  };
}

export const PRESET_CONFIGS: Record<SeedSize, SeedConfig['counts']> = {
  small: {
    users: 100,
    customers: 100,
    categories: 15,
    suppliers: 20,
    stores: 5,
    products: 100,
    orders: 500,
    reviews: 150,
  },
  medium: {
    users: 500,
    customers: 500,
    categories: 20,
    suppliers: 50,
    stores: 10,
    products: 500,
    orders: 5000,
    reviews: 1500,
  },
  large: {
    users: 2000,
    customers: 2000,
    categories: 20,
    suppliers: 75,
    stores: 15,
    products: 1000,
    orders: 25000,
    reviews: 5000,
  },
};

export function getSeedConfig(): SeedConfig {
  const args = process.argv.slice(2);
  let size: SeedSize = 'small';

  const sizeArgIndex = args.indexOf('--size');
  if (sizeArgIndex !== -1 && args[sizeArgIndex + 1]) {
    const passedSize = args[sizeArgIndex + 1].toLowerCase() as SeedSize;
    if (['small', 'medium', 'large'].includes(passedSize)) {
      size = passedSize;
    }
  } else if (process.env.SEED_SIZE && ['small', 'medium', 'large'].includes(process.env.SEED_SIZE.toLowerCase())) {
    size = process.env.SEED_SIZE.toLowerCase() as SeedSize;
  }

  const randomSeed = process.env.SEED_RANDOM_SEED
    ? parseInt(process.env.SEED_RANDOM_SEED, 10)
    : 2026;

  const startDate = process.env.SEED_START_DATE
    ? new Date(process.env.SEED_START_DATE)
    : new Date('2025-01-01T00:00:00.000Z');

  const endDate = process.env.SEED_END_DATE
    ? new Date(process.env.SEED_END_DATE)
    : new Date('2026-09-01T23:59:59.000Z');

  return {
    size,
    randomSeed,
    startDate,
    endDate,
    counts: PRESET_CONFIGS[size],
  };
}
