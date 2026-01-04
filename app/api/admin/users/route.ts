import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/users - List all users
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/admin/users - Update user status/role
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
    
        if (!session || session.user.role !== "ADMIN") {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { userId, isBlocked, role } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updateData: any = {};
        if (isBlocked !== undefined) updateData.isBlocked = isBlocked;
        if (role !== undefined) updateData.role = role;

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                role: true,
                // isBlocked: true
            }
        });

        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
