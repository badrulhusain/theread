
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  let url = process.env.DATABASE_URL;
  if (!url) {
      console.error("No URL");
      process.exit(1);
  }
  
  // Replace protocol
  if (url.startsWith("prisma+postgres://")) {
      url = url.replace("prisma+postgres://", "postgres://");
      console.log("Modified URL protocol to postgres://");
  }

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Connecting with modified URL...");
    await prisma.$connect();
    console.log("Connected successfully!");
    const count = await prisma.user.count();
    console.log(`User count: ${count}`);
  } catch (e) {
    console.error("Connection failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
