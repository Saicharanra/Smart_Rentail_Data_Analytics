import { SeededRandom } from './random';

export function generateOrderTimestamp(
  startDate: Date,
  endDate: Date,
  random: SeededRandom
): Date {
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  
  // Pick random day between start and end
  const randomMs = random.float(startMs, endMs);
  const date = new Date(randomMs);

  // Apply daytime / evening purchase curve weighting (Peak 10am - 9pm)
  const hourWeights = [
    0.1, 0.05, 0.02, 0.01, 0.01, 0.02, 0.05, 0.15, // 00:00 - 07:59
    0.4, 0.8, 1.0, 1.2, 1.1, 1.0, 0.9, 0.95,      // 08:00 - 15:59
    1.1, 1.3, 1.5, 1.4, 1.2, 0.9, 0.5, 0.2       // 16:00 - 23:59
  ];
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const selectedHour = random.weightedChoice(hours, hourWeights);

  date.setUTCHours(selectedHour);
  date.setUTCMinutes(random.int(0, 59));
  date.setUTCSeconds(random.int(0, 59));

  return date;
}

export function getSeasonalMultiplier(date: Date): number {
  const month = date.getUTCMonth(); // 0 = Jan, 11 = Dec

  // Indian/Global Retail Seasonality Peaks:
  // Oct (9) & Nov (10): Diwali/Dussehra/Festive Sale (1.8x - 2.2x)
  // Dec (11): Year-End & Christmas (1.6x)
  // May (4): Summer Sale (1.3x)
  // Aug (7): Independence/Mid-year Sale (1.3x)
  if (month === 9 || month === 10) return 2.0;
  if (month === 11) return 1.6;
  if (month === 4 || month === 7) return 1.3;
  return 1.0;
}
