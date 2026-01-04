import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user not found to prevent enumeration
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // In a real app, send email here. For now, log to console.
    console.log(`Password reset token for ${email}: ${token}`);

    return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
