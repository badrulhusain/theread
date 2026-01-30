
import "dotenv/config";
import { db } from "../lib/prisma";

async function main() {
  try {
    console.log("Attempting to query users...");
    const count = await db.user.count();
    console.log("Fix verified! User count:", count);
  } catch (e) {
    console.error("Fix failed:", e);
    process.exit(1);
  }
}
main();
