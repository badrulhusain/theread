import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/blogs - List all blogs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const authorId = searchParams.get("authorId");

    const where: any = {};
    
    if (status && (status === "draft" || status === "published")) {
      where.status = status;
    }
    
    if (authorId) {
      where.authorId = authorId;
    }

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

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
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
    const { title, content, categoryId, tagIds, status, featuredImage } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const blog = await db.blog.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        categoryId: categoryId || null,
        tags: tagIds && tagIds.length > 0 ? {
          connect: tagIds.map((id: string) => ({ id })),
        } : undefined,
        status: status || "draft",
        featuredImage: featuredImage || null,
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
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
