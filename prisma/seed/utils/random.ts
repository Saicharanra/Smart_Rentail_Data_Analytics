// Mulberry32 deterministic pseudo-random number generator (PRNG)
export class SeededRandom {
  private state: number;

  constructor(seed: number = 2026) {
    this.state = seed;
  }

  // Returns float in range [0, 1)
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Returns integer in range [min, max] inclusive
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Returns float in range [min, max)
  float(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  // Returns boolean with given true probability [0, 1]
  bool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  // Selects random element from array
  choice<T>(array: T[]): T {
    if (!array || array.length === 0) {
      throw new Error('Cannot select choice from empty array');
    }
    const idx = Math.floor(this.next() * array.length);
    return array[idx];
  }

  // Selects element based on weights
  weightedChoice<T>(items: T[], weights: number[]): T {
    if (items.length !== weights.length) {
      throw new Error('Items and weights must have identical length');
    }
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    let randomVal = this.next() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      if (randomVal < weights[i]) {
        return items[i];
      }
      randomVal -= weights[i];
    }
    return items[items.length - 1];
  }

  // Shuffles array in-place deterministically using Fisher-Yates
  shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Log-Normal approximation for price/quantity distributions
  logNormal(mu: number, sigma: number): number {
    const u1 = Math.max(1e-15, this.next());
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return Math.exp(mu + sigma * z0);
  }
}
