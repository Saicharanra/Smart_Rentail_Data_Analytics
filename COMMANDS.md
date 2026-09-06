# 🚀 Smart Retail Analytics Platform - Command Reference Guide

This document contains all the terminal commands, database utilities, API inspection endpoints, and credentials required to run, test, and inspect the application.

---

## 🛠️ 1. Project Run & Build Commands

| Action | Terminal Command | Description |
| :--- | :--- | :--- |
| **Start Development Server** | `npm run dev` | Starts the Next.js App Router server on `http://localhost:3000` with hot-reloading. |
| **Run Type Checking** | `npx tsc --noEmit` | Checks the entire TypeScript codebase for type errors (0 errors expected). |
| **Build for Production** | `npm run build` | Compiles and builds optimized Next.js production bundle. |
| **Start Production Server** | `npm start` | Runs the compiled production build locally. |
| **Lint Codebase** | `npm run lint` | Runs ESLint checks across all project files. |

---

## 🗄️ 2. Database & Prisma ORM Commands

| Action | Terminal Command | Description |
| :--- | :--- | :--- |
| **Database Health Check** | `http://localhost:3000/api/health` | Tests live PostgreSQL connection status via API endpoint. |
| **Sync Database Schema** | `npx prisma db push` | Creates/updates all PostgreSQL tables based on `prisma/schema.prisma`. |
| **Generate Prisma Client** | `npx prisma generate` | Generates updated `@prisma/client` TypeScript types. |
| **Seed Database** | `npm run prisma:seed` | Populates database with 50+ Users, 100+ Products, Stores & 40+ Orders. |
| **Open Database GUI** | `npx prisma studio` | Opens interactive visual web database viewer at `http://localhost:5555`. |
| **Format Schema File** | `npx prisma format` | Formats `prisma/schema.prisma` definitions. |

---

## 🔑 3. Default Login Credentials

| Role | Email | Password | Target Dashboard |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@retail.bi` | `Password123!` | `http://localhost:3000/admin` |
| **Customer User** | `customer1@example.com` | `Password123!` | `http://localhost:3000/shop` |

---

## 🌐 4. Application URL Routes

- **Storefront Home**: [`http://localhost:3000`](http://localhost:3000)
- **Product Catalog (Shop)**: [`http://localhost:3000/shop`](http://localhost:3000/shop)
- **Product Detail**: [`http://localhost:3000/products/prod-101`](http://localhost:3000/products/prod-101)
- **Categories Directory**: [`http://localhost:3000/categories`](http://localhost:3000/categories)
- **Order History & Tracking**: [`http://localhost:3000/orders`](http://localhost:3000/orders)
- **Sign In Page**: [`http://localhost:3000/login`](http://localhost:3000/login)
- **Register / Sign-Up Page**: [`http://localhost:3000/register`](http://localhost:3000/register)
- **Executive BI Admin Dashboard**: [`http://localhost:3000/admin`](http://localhost:3000/admin)
- **Stock Inventory Alerts**: [`http://localhost:3000/admin/inventory`](http://localhost:3000/admin/inventory)
- **Synapse Analytics**: [`http://localhost:3000/admin/analytics`](http://localhost:3000/admin/analytics)
- **Customer Directory**: [`http://localhost:3000/admin/customers`](http://localhost:3000/admin/customers)
- **Database Health Check API**: [`http://localhost:3000/api/health`](http://localhost:3000/api/health)

---

## 💻 5. Direct Database SQL Queries (psql)

If PostgreSQL `psql` client is installed, you can connect directly to inspect tables:

```bash
psql -U postgres -h localhost -p 5432 -d smart_retail_db
```

### Useful Inspection SQL Queries:

```sql
-- View all registered Users
SELECT id, email, name, role, "createdAt" FROM "User";

-- Count total products in catalog
SELECT COUNT(*) FROM "Product";

-- View total orders and order amounts
SELECT "orderNumber", "totalAmount", status, "createdAt" FROM "Order" ORDER BY "createdAt" DESC LIMIT 10;

-- Inspect inventory low stock items
SELECT p.name, i.quantity, i."reorderLevel" 
FROM "Inventory" i 
JOIN "Product" p ON i."productId" = p.id 
WHERE i.quantity <= i."reorderLevel";
```

---

## 🧪 6. Testing API Routes via Curl / PowerShell

### A. Test Database Connection API:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
```

### B. Test User Login API:
```powershell
$body = @{ email = "admin@retail.bi"; password = "Password123!" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

### C. Test Customer Registration API:
```powershell
$body = @{ name = "Test User"; email = "newuser@example.com"; password = "Password123!"; role = "CUSTOMER" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

---

## 📂 7. Key Configuration Files

- **Prisma Schema**: [`prisma/schema.prisma`](file:///c:/Users/saich/Desktop/New%20folder/Rentail/prisma/schema.prisma)
- **Database Seed Script**: [`prisma/seed.ts`](file:///c:/Users/saich/Desktop/New%20folder/Rentail/prisma/seed.ts)
- **Environment File**: [`.env`](file:///c:/Users/saich/Desktop/New%20folder/Rentail/.env)
- **Auth Utils**: [`lib/auth.ts`](file:///c:/Users/saich/Desktop/New%20folder/Rentail/lib/auth.ts)
- **Mock Data Catalog**: [`lib/mock-data.ts`](file:///c:/Users/saich/Desktop/New%20folder/Rentail/lib/mock-data.ts)
