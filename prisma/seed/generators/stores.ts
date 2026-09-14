import { PrismaClient, Store } from '@prisma/client';
import { SeededRandom } from '../utils/random';

const STORES_MASTER = [
  { name: 'Online Store Direct Hub', code: 'STR-ONLINE-00', address: '100 Cloud Way, Financial District', city: 'Hyderabad', state: 'Telangana', zipCode: '500032', isOnline: true },
  { name: 'Hyderabad Banjara Hills Hub', code: 'STR-HYD-01', address: 'Road No. 12, Banjara Hills', city: 'Hyderabad', state: 'Telangana', zipCode: '500034', isOnline: false },
  { name: 'Hyderabad Hitec City Hub', code: 'STR-HYD-02', address: 'Cyber Towers Quad, Madhapur', city: 'Hyderabad', state: 'Telangana', zipCode: '500081', isOnline: false },
  { name: 'Bengaluru Indiranagar Hub', code: 'STR-BLR-01', address: '100 Feet Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', zipCode: '560038', isOnline: false },
  { name: 'Bengaluru Whitefield Hub', code: 'STR-BLR-02', address: 'ITPL Main Road, Whitefield', city: 'Bengaluru', state: 'Karnataka', zipCode: '560066', isOnline: false },
  { name: 'Chennai T-Nagar Hub', code: 'STR-MAA-01', address: 'Usman Road, T-Nagar', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600017', isOnline: false },
  { name: 'Mumbai Lower Parel Hub', code: 'STR-BOM-01', address: 'High Street Phoenix, Lower Parel', city: 'Mumbai', state: 'Maharashtra', zipCode: '400013', isOnline: false },
  { name: 'Delhi Connaught Place Hub', code: 'STR-DEL-01', address: 'Block C, Connaught Place', city: 'New Delhi', state: 'Delhi', zipCode: '110001', isOnline: false },
  { name: 'Pune Viman Nagar Hub', code: 'STR-PNQ-01', address: 'Phoenix Market City, Viman Nagar', city: 'Pune', state: 'Maharashtra', zipCode: '411014', isOnline: false },
  { name: 'Kolkata Salt Lake Hub', code: 'STR-CCU-01', address: 'Sector V, Salt Lake', city: 'Kolkata', state: 'West Bengal', zipCode: '700091', isOnline: false },
  { name: 'Ahmedabad SG Highway Hub', code: 'STR-AMD-01', address: 'S.G. Highway, Thaltej', city: 'Ahmedabad', state: 'Gujarat', zipCode: '380054', isOnline: false },
  { name: 'Seattle Flagship Hub', code: 'STR-SEA-01', address: '700 Fifth Avenue', city: 'Seattle', state: 'WA', zipCode: '98104', isOnline: false },
  { name: 'Austin Downtown Tech Center', code: 'STR-ATX-01', address: '200 Congress Ave', city: 'Austin', state: 'TX', zipCode: '78701', isOnline: false },
  { name: 'San Francisco SOMA Hub', code: 'STR-SFO-01', address: 'market Street', city: 'San Francisco', state: 'CA', zipCode: '94103', isOnline: false },
  { name: 'Chicago River North Hub', code: 'STR-CHI-01', address: 'Michigan Avenue', city: 'Chicago', state: 'IL', zipCode: '60611', isOnline: false },
];

export async function generateStores(
  prisma: PrismaClient,
  count: number,
  random: SeededRandom
): Promise<Store[]> {
  const selected = STORES_MASTER.slice(0, Math.min(count, STORES_MASTER.length));
  const stores: Store[] = [];

  for (const s of selected) {
    const store = await prisma.store.upsert({
      where: { code: s.code },
      update: { name: s.name, address: s.address },
      create: s,
    });
    stores.push(store);
  }

  return stores;
}
