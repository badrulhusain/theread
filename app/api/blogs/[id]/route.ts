import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { trackView } from "@/lib/services/views";

// GET /api/blogs/[id] - Get a single blog by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await db.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Track view asynchronously
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const session = await getServerSession(authOptions).catch(() => null);
    
    // Using await here to ensure it completes in serverless environments
    await trackView(id, ip, session?.user?.id).catch(err => {
      console.error("Failed to track view:", err);
    });

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// PATCH /api/blogs/[id] - Update a blog by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    if (session.user.isBlocked) {
        return NextResponse.json({ error: "Your account is blocked" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, categoryId, tagIds, status, featuredImage } = body;

    // Check if blog exists
    const existingBlog = await db.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // RBAC: Only Author or Admin can edit
    if (existingBlog.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. You can only update your own blogs." },
        { status: 403 }
      );
    }

    // Build update data object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (tagIds !== undefined) {
        updateData.tags = {
            set: tagIds.map((tagId: string) => ({ id: tagId }))
        };
    }
    if (status !== undefined) updateData.status = status;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;

    const updatedBlog = await db.blog.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Delete a blog by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    if (session.user.isBlocked) {
        return NextResponse.json({ error: "Your account is blocked" }, { status: 403 });
    }

    const { id } = await params;

    // Check if blog exists
    const existingBlog = await db.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // RBAC: Only Author or Admin can delete
    if (existingBlog.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. You can only delete your own blogs." },
        { status: 403 }
      );
    }

    await db.blog.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
