
import "dotenv/config";
console.log("Environment loaded");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "Undefined");

import { db } from "../lib/prisma";

async function main() {
  try {
    console.log("Simulating GET /api/blogs query...");
    const where: any = {};
    
    console.log("Executing finding many blogs...");
    const blogs = await db.blog.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(`Success! Found ${blogs.length} blogs.`);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
