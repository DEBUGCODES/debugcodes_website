import { PrismaClient } from "@/generated/prisma/client"
import { Client } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("FATAL: DATABASE_URL not set in environment variables");
}

// 1. Initialize the PlanetScale Client object using the connection string.
// This is the 'Client' type the adapter expects.
// We use 'new Client' instead of 'connect'.
const connection = new Client({ url: connectionString });


// 2. Create the Prisma Adapter instance
// The adapter takes the client instance (connection)
const adapter = new PrismaPlanetScale(connection);


// 3. Implement the Next.js/Vercel Singleton pattern
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ 
    adapter, // Pass the adapter to the constructor
  });

// Only assign to the global object in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}