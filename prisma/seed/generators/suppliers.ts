import { PrismaClient, Supplier } from '@prisma/client';
import { SeededRandom } from '../utils/random';

const SUPPLIER_NAMES = [
  'Apex Audio Tech Ltd', 'Nordic Workspaces Inc', 'BioMetrics Global', 'LuminaTech Systems',
  'Quantum Gear Corp', 'AeroGlide Solutions', 'CyberPulse Electronics', 'Vortex Storage Ltd',
  'Titan Power Systems', 'Zenith Acoustic Labs', 'Silicon Valley Micro', 'Deccan Tech Components',
  'Bangalore Hardware Labs', 'Hyderabad Semiconductor', 'Chennai Optoelectronics', 'Mumbai Logistics Tech',
  'Delhi Digital Supply', 'Kolkata Industrial Gear', 'Pune Precision Tech', 'Kochi Microcircuits',
  'Aura Retail Logistics', 'Starlight Tech Solutions', 'Velocity Components Co', 'Matrix Supply Chain',
  'Horizon Electronics Asia', 'Pacific Trade Partners', 'Atlas Hardware Global', 'Nova Sound Systems',
  'Elysium Home Tech', 'Prism Light Labs', 'Frontier Network Gear', 'HyperDrive Storage Systems',
  'Pulse Wearables International', 'Optima Energy Systems', 'Nexus Robotix Corp', 'Stealth Tech Hardware',
  'Zenith Enterprise Systems', 'Pinnacle Supply Co', 'Vanguard Microtech', 'Omni Retail Solutions',
  'Solaria Solar Tech', 'Aether Acoustics', 'Genesis Computing Hardware', 'Summit Digital Ltd',
  'Orion Components Inc', 'Valence Battery Systems', 'Titanium Gears India', 'Coromandel Tech Solutions',
  'Malabar Micro Systems', 'Godavari Tech Supplies', 'Narmada Component Corp', 'Indus Valley Electronics',
  'Himalaya Tech Traders', 'Vindhya Supply Chain', 'Ganges Hardware Co', 'Kaveri Digital Products',
  'Sabarmati Tech Solutions', 'Brahmaputra Global Gear', 'Yamuna Micro Systems', 'Krishna Retail Supply',
  'Konkan Components Ltd', 'Utkal Digital Labs', 'Sundarbans Tech Trade', 'Thar Electronics Corp',
  'Nilgiri Audio Systems', 'Sahyadri Hardware Inc', 'Zanskar Precision Tech', 'Pir Panjal Components',
  'Cardamom Tech Traders', 'Coromandel Electronics', 'Deccan Heights Tech', 'Vanguard Retail India',
  'Infinitum Hardware Labs', 'Apex Global Logistics', 'Zenith Tech Traders'
];

const CONTACT_FIRST_NAMES = ['Robert', 'Freja', 'David', 'Sarah', 'Michael', 'Elena', 'Alex', 'Kenji', 'James', 'Claire', 'Rajesh', 'Priya', 'Ananya', 'Vikram', 'Suresh', 'Kavita', 'Arjun', 'Meera', 'Rohan', 'Deepa'];
const CONTACT_LAST_NAMES = ['Sterling', 'Lindqvist', 'Chen', 'Jenkins', 'Chang', 'Rostova', 'Rivera', 'Sato', 'O\'Connor', 'Bennett', 'Sharma', 'Patel', 'Rao', 'Nair', 'Reddy', 'Gupta', 'Verma', 'Kumar', 'Deshmukh', 'Joshi'];

export async function generateSuppliers(
  prisma: PrismaClient,
  count: number,
  categoryNames: string[],
  random: SeededRandom
): Promise<Supplier[]> {
  const suppliers: Supplier[] = [];

  for (let i = 0; i < count; i++) {
    const name = SUPPLIER_NAMES[i % SUPPLIER_NAMES.length] + (i >= SUPPLIER_NAMES.length ? ` #${Math.floor(i / SUPPLIER_NAMES.length) + 1}` : '');
    const contactPerson = `${random.choice(CONTACT_FIRST_NAMES)} ${random.choice(CONTACT_LAST_NAMES)}`;
    const category = random.choice(categoryNames);
    const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    const email = `supply@${domain}`;
    const phone = `+91 ${random.int(7000, 9999)} ${random.int(100000, 999999)}`;
    const leadTimeDays = random.int(2, 10);
    const rating = Math.round(random.float(4.0, 5.0) * 10) / 10;

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactPerson,
        email,
        phone,
        address: `${random.int(10, 999)} Tech Park Sector ${random.int(1, 44)}`,
        category,
        leadTimeDays,
        rating,
        status: 'Active',
      },
    });
    suppliers.push(supplier);
  }

  return suppliers;
}
