import { db } from "../lib/prisma";

async function main() {
  console.log("--- Prisma Client Check ---");
  console.log("DB defined:", !!db);
  if (db) {
    console.log("Available models:", Object.keys(db).filter(key => !key.startsWith("$") && !key.startsWith("_")));
    console.log("postView available:", !!(db as any).postView);
    console.log("blog available:", !!(db as any).blog);
  }
}

main().catch(console.error);
