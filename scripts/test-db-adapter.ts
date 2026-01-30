
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL is not defined in environment variables.");
    process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log(`Successfully connected. User count: ${userCount}`);
  } catch (e) {
    console.error("Error connecting to database:", e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
