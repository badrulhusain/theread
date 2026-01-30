import { db } from "@/lib/prisma";
import { createHash } from "crypto";

const DEDUPLICATION_WINDOW_MINUTES = 30;

export async function trackView(postId: string, ip: string, sessionId?: string) {
  // Create a unique identifier based on IP and/or Session ID
  const identifier = createHash("sha256")
    .update(`${ip}-${sessionId || ""}`)
    .digest("hex");

  const windowStart = new Date(Date.now() - DEDUPLICATION_WINDOW_MINUTES * 60 * 1000);

  // Check for existing view in the deduplication window
  const existingView = await db.postView.findFirst({
    where: {
      postId,
      identifier,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  if (existingView) {
    return { success: false, reason: "deduplicated" };
  }

  // Register new view
  await db.postView.create({
    data: {
      postId,
      identifier,
    },
  });

  return { success: true };
}

/**
 * Syncs view counts from PostView table to Blog table.
 */
export async function syncViewCounts() {
  console.log("Syncing view counts...");

  const blogViews = await db.postView.groupBy({
    by: ["postId"],
    _count: {
      id: true,
    },
  });

  for (const item of blogViews) {
    await db.blog.update({
      where: { id: item.postId },
      data: {
        viewCount: item._count.id,
      },
    });
  }

  console.log(`Synced ${blogViews.length} blog view counts.`);
}
