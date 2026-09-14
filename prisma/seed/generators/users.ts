import { PrismaClient, Role, Customer } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SeededRandom } from '../utils/random';

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Aditya', 'Diya', 'Vihaan', 'Ishani', 'Kabir', 'Myra', 'Sai', 'Riya',
  'Reyansh', 'Aadhya', 'Krishna', 'Saanvi', 'Arjun', 'Anushka', 'Rohan', 'Tanvi', 'Dev', 'Kavya',
  'Eleanor', 'Liam', 'Sophia', 'Jackson', 'Olivia', 'Lucas', 'Emma', 'Aiden', 'Ava', 'Ethan',
  'Vikram', 'Pooja', 'Rahul', 'Neha', 'Sanjay', 'Sneha', 'Karthik', 'Swati', 'Manish', 'Deepika'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Rao', 'Nair', 'Gupta', 'Kumar', 'Singh', 'Joshi',
  'Deshmukh', 'Kulkarni', 'Iyer', 'Menon', 'Chowdhury', 'Chatterjee', 'Vance', 'Smith', 'Johnson', 'Brown',
  'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Clark', 'Lewis', 'Robinson'
];

const CITIES_STATES = [
  { city: 'Hyderabad', state: 'Telangana', country: 'India', zipPrefix: '5000' },
  { city: 'Bengaluru', state: 'Karnataka', country: 'India', zipPrefix: '5600' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India', zipPrefix: '6000' },
  { city: 'Mumbai', state: 'Maharashtra', country: 'India', zipPrefix: '4000' },
  { city: 'Delhi', state: 'Delhi', country: 'India', zipPrefix: '1100' },
  { city: 'Pune', state: 'Maharashtra', country: 'India', zipPrefix: '4110' },
  { city: 'Seattle', state: 'WA', country: 'USA', zipPrefix: '9810' },
  { city: 'Austin', state: 'TX', country: 'USA', zipPrefix: '7870' },
  { city: 'San Francisco', state: 'CA', country: 'USA', zipPrefix: '9410' },
  { city: 'Chicago', state: 'IL', country: 'USA', zipPrefix: '6060' },
];

export async function generateUsersAndCustomers(
  prisma: PrismaClient,
  customerCount: number,
  random: SeededRandom
): Promise<{ adminUser: any; customerProfiles: Customer[] }> {
  // Pre-compute single bcrypt hash for seeding speed
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Ensure Admin User exists
  let adminUser = await prisma.user.findUnique({ where: { email: 'admin@retail.bi' } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@retail.bi',
        name: 'System Admin',
        passwordHash,
        role: Role.ADMIN,
      },
    });
  }

  // 2. Batch generate customer users & customer profiles
  const customerProfiles: Customer[] = [];
  const chunkSize = 200;

  for (let i = 0; i < customerCount; i += chunkSize) {
    const currentChunkSize = Math.min(chunkSize, customerCount - i);

    for (let j = 0; j < currentChunkSize; j++) {
      const index = i + j + 1;
      const firstName = random.choice(FIRST_NAMES);
      const lastName = random.choice(LAST_NAMES);
      const name = `${firstName} ${lastName}`;
      const email = `customer${index}@retail.bi`;
      const location = random.choice(CITIES_STATES);
      const phone = `+91 ${random.int(7000, 9999)} ${random.int(100000, 999999)}`;
      const postalCode = `${location.zipPrefix}${random.int(10, 99)}`;
      const segment = random.weightedChoice(['VIP', 'Regular', 'New'], [15, 60, 25]);

      const user = await prisma.user.upsert({
        where: { email },
        update: { name },
        create: {
          email,
          name,
          passwordHash,
          role: Role.CUSTOMER,
          customer: {
            create: {
              phone,
              address: `${random.int(10, 999)} Innovation Avenue, Block ${random.choice(['A', 'B', 'C', 'D'])}`,
              city: location.city,
              state: location.state,
              postalCode,
              country: location.country,
              segment,
            },
          },
        },
        include: { customer: true },
      });

      if (user.customer) {
        customerProfiles.push(user.customer);
      }
    }
  }

  return { adminUser, customerProfiles };
}
