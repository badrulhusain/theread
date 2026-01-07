import { NextRequest, NextResponse } from "next/server";
import { syncViewCounts } from "@/lib/services/views";

export async function GET(req: NextRequest) {
  // Optional: Add a simple secret check for security
  // const authHeader = req.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  try {
    await syncViewCounts();
    return NextResponse.json({ success: true, message: "View counts synced" });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
