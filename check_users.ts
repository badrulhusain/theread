
import { db } from "@/lib/prisma";

async function main() {
  try {
    const users = await db.user.findMany();
    console.log("Users in DB:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

main();
