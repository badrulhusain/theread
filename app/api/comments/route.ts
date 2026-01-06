import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/comments - List comments (usually for a specific blog)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json(
        { error: "blogId is required" },
        { status: 400 }
      );
    }

    const comments = await db.comment.findMany({
      where: {
        blogId,
        parentId: null, // Get top-level comments first
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        replies: {
          where: {
            deletedAt: null,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a new comment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.isBlocked) {
      return NextResponse.json(
        { error: "Your account is blocked" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { content, blogId, parentId } = body;

    if (!content || !blogId) {
      return NextResponse.json(
        { error: "Content and blogId are required" },
        { status: 400 }
      );
    }

    // Verify blog exists
    const blog = await db.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    const comment = await db.comment.create({
      data: {
        content,
        blogId,
        authorId: session.user.id,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
