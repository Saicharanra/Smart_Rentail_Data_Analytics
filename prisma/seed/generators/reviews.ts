import { PrismaClient, Review } from '@prisma/client';
import { SeededRandom } from '../utils/random';

const REVIEW_TITLES_BY_RATING: Record<number, string[]> = {
  5: ['Exceptional performance & build quality!', 'Best purchase of the year!', 'Outstanding value and battery life', 'Exceeded expectations completely', 'Must-have smart retail product'],
  4: ['Solid performance and sleek design', 'Very good value for money', 'Great build quality with minor software quibble', 'Reliable daily driver', 'Satisfied with fast shipping'],
  3: ['Decent product but average battery life', 'Works as expected, nothing extraordinary', 'Good hardware, okay software app', 'Average value for the price point'],
  2: ['Below expectations, minor connectivity issues', 'Disappointed with materials', 'Build quality could be improved'],
  1: ['Subpar quality, stopped working after a week', 'Regret purchase, terrible customer support', 'Does not match product description'],
};

const REVIEW_COMMENTS_BY_RATING: Record<number, string[]> = {
  5: [
    'The product arrived in perfect packaging and setup took under 2 minutes. Performance is blazing fast and telemetry integration works flawlessly.',
    'High quality components and premium tactile feel. Highly recommended for any smart workplace or personal tech setup.',
    'Extremely impressed with the speed and reliability. Will definitely purchase again from Aura Retail.',
  ],
  4: [
    'Overall very satisfied with the build quality and performance. Shipping was quick and customer service answered my queries promptly.',
    'Good product that delivers on its core promises. Ergonomics are solid and battery efficiency is impressive.',
  ],
  3: [
    'The hardware is decent and functional. However, setup instructions could be clearer. Works okay overall.',
  ],
  2: [
    'Encountered intermittent Bluetooth/Wi-Fi connection drops. The design is nice but reliability leaves room for improvement.',
  ],
  1: [
    'Unit failed within days of unboxing. Had to contact customer support for a replacement warranty request.',
  ],
};

export async function generateReviews(
  prisma: PrismaClient,
  count: number,
  deliveredOrders: Array<{ id: string; customerId: string; items: Array<{ productId: string }> }>,
  random: SeededRandom
): Promise<number> {
  const ratings = [5, 4, 3, 2, 1];
  const ratingWeights = [50, 30, 12, 5, 3];

  const reviewPairsSet = new Set<string>();
  const reviewsData: Array<{
    customerId: string;
    productId: string;
    rating: number;
    title: string;
    comment: string;
  }> = [];

  // 1. Generate reviews from verified customer purchase orders
  for (const order of deliveredOrders) {
    if (reviewsData.length >= count) break;

    for (const item of order.items) {
      if (reviewsData.length >= count) break;

      const pairKey = `${order.customerId}_${item.productId}`;
      if (reviewPairsSet.has(pairKey)) continue;

      const rating = random.weightedChoice(ratings, ratingWeights);
      const titlePool = REVIEW_TITLES_BY_RATING[rating];
      const commentPool = REVIEW_COMMENTS_BY_RATING[rating];

      const title = random.choice(titlePool);
      const comment = random.choice(commentPool);

      reviewPairsSet.add(pairKey);
      reviewsData.push({
        customerId: order.customerId,
        productId: item.productId,
        rating,
        title,
        comment,
      });
    }
  }

  // Batch insert reviews in chunks of 500
  const chunkSize = 500;
  for (let i = 0; i < reviewsData.length; i += chunkSize) {
    const chunk = reviewsData.slice(i, i + chunkSize);
    await prisma.review.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  return reviewsData.length;
}
