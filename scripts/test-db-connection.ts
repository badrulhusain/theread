
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log(`Successfully connected. User count: ${userCount}`);
  } catch (e) {
    console.error("Error connecting to database:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
