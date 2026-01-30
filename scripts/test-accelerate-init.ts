
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

async function main() {
  const url = process.env.DATABASE_URL;
  console.log("Testing connection with URL starting with:", url?.split("://")[0]);

  if (!url) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }

  // initialize with datasourceUrl
  const prisma = new PrismaClient({
    datasourceUrl: url,
  });

  try {
    console.log("Connecting...");
    await prisma.$connect();
    console.log("Connected successfully!");
    const count = await prisma.user.count();
    console.log(`User count: ${count}`);
  } catch (e) {
    console.error("Connection failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
